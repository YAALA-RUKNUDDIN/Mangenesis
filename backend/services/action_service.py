"""
Action Optimization Service
Uses Mixed-Integer Linear Programming (MILP) via PuLP CBC branch-and-cut solver
to compute optimal resource redeployments and mitigate shortfalls per MOIL mine.
"""

import os
import time
import pulp
from typing import Dict, Any, List
from backend.config import MINES, SCENARIOS, EQUIPMENT_FLEETS, DEFAULT_MINE_ID


def _solve_milp_dispatch(fleet: List[Dict], zones: List[Dict], shortfall_tonnes: int, scenario_id: str) -> Dict[str, Any]:
    """
    Formulates and solves a genuine Mixed-Integer Linear Program for optimal fleet dispatch.

    Decision Variables:
        x[i,j] = hours equipment i is assigned to zone j (continuous, 0 to max_shift)
        y[i]   = 1 if equipment i is redeployed from current zone (binary)
        o[i]   = 1 if emergency hydraulic overhaul is dispatched on degraded
                 unit i (binary; only created for units with status DEGRADED
                 or health < 70). Overhaul restores 45% of rated TPH.
        b[i]   = recovered tonnage credited to the restored capacity of unit i
                 (continuous; linearly bounded by o[i])

    Objective:
        Maximize total recovered tonnage (base + restored) minus relocation
        fuel cost and emergency overhaul mobilization cost.

    Constraints:
        - Each equipment unit's total assigned hours <= max shift (16h)
        - Zone loading capacity not exceeded
        - Total recovery bounded by shortfall (no overproduction beyond 105%)
    """
    start_time = time.time()

    prob = pulp.LpProblem("MANGENESIS_Pit_Recovery_Optimization", pulp.LpMaximize)

    max_shift_hours = 16.0
    fuel_cost_per_hour = 94.0  # INR/L * L/hr approximation
    overhaul_cost_tonnes = 220.0     # overhaul mobilization cost, tonne-equivalent
    overhaul_restore_fraction = 0.45  # restored TPH fraction on degraded units

    def _is_degraded(eq: Dict) -> bool:
        return eq.get("status", "OPERATIONAL") == "DEGRADED" or eq.get("health", 100) < 70

    # Decision variables
    x = {}  # x[equip_id, zone_id] = hours assigned
    y = {}  # y[equip_id] = binary redeployment flag
    o = {}  # o[equip_id] = binary emergency overhaul dispatch (degraded units only)
    b = {}  # b[equip_id] = recovered tonnes from restored capacity

    for eq in fleet:
        eid = eq["id"]
        y[eid] = pulp.LpVariable("redeploy_%s" % eid, cat=pulp.LpBinary)
        if _is_degraded(eq):
            o[eid] = pulp.LpVariable("overhaul_%s" % eid, cat=pulp.LpBinary)
            b[eid] = pulp.LpVariable("restored_tonnes_%s" % eid, 0)
        for z in zones:
            zid = z["id"]
            x[(eid, zid)] = pulp.LpVariable("assign_%s_to_%s" % (eid, zid), 0, max_shift_hours)

    # Objective: Maximize (base + restored) recovered tonnes - fuel and overhaul costs
    prob += (
        pulp.lpSum([
            x[(eq["id"], z["id"])] * eq["capacity_tph"] - x[(eq["id"], z["id"])] * fuel_cost_per_hour * 0.15
            for eq in fleet for z in zones
        ])
        + pulp.lpSum(b.values())
        - pulp.lpSum(o.values()) * overhaul_cost_tonnes
    )

    # Constraint 1: Each equipment total hours <= max shift
    for eq in fleet:
        prob += pulp.lpSum([x[(eq["id"], z["id"])] for z in zones]) <= max_shift_hours

    # Constraint 2: Equipment only works if redeployed flag is set
    for eq in fleet:
        for z in zones:
            prob += x[(eq["id"], z["id"])] <= max_shift_hours * y[eq["id"]]

    # Constraint 3: Total recovery (base + restored) <= 105% of shortfall
    prob += pulp.lpSum([
        x[(eq["id"], z["id"])] * eq["capacity_tph"]
        for eq in fleet for z in zones
    ]) + pulp.lpSum(b.values()) <= shortfall_tonnes * 1.05

    # Constraint 3b: Restored tonnage only flows when overhaul is dispatched
    for eq in fleet:
        if eq["id"] in o:
            prob += b[eq["id"]] <= overhaul_restore_fraction * eq["capacity_tph"] * max_shift_hours * o[eq["id"]]

    # Constraint 4: Zone demand upper limits
    for z in zones:
        zone_cap = z.get("demand_t", shortfall_tonnes * 0.6)
        prob += pulp.lpSum([
            x[(eq["id"], z["id"])] * eq["capacity_tph"] for eq in fleet
        ]) <= zone_cap * 1.1

    # Solve via CBC branch-and-cut; capture solver log for node/iteration telemetry
    import re
    import tempfile

    log_path = os.path.join(tempfile.gettempdir(), "mangenesis_cbc.log")
    try:
        prob.solve(pulp.PULP_CBC_CMD(msg=False, timeLimit=0.5, logPath=log_path))
    except TypeError:
        prob.solve(pulp.PULP_CBC_CMD(msg=False, timeLimit=0.5))
        log_path = None
    solve_time_ms = round((time.time() - start_time) * 1000, 1)

    # Parse branch-and-cut node exploration count from the CBC log
    nodes_explored = 0
    if log_path and os.path.exists(log_path):
        try:
            with open(log_path, "r", encoding="utf-8", errors="ignore") as fh:
                node_hits = re.findall(r"after (\d+) nodes", fh.read())
            nodes_explored = max((int(n) for n in node_hits), default=0)
        except OSError:
            nodes_explored = 0

    # Extract results
    solver_status = pulp.LpStatus[prob.status]
    objective_value = pulp.value(prob.objective) if prob.status == 1 else 0

    assignments = []
    total_recovered = 0
    for eq in fleet:
        for z in zones:
            hours = pulp.value(x[(eq["id"], z["id"])]) or 0
            if hours > 0.1:
                tonnes = hours * eq["capacity_tph"]
                total_recovered += tonnes
                assignments.append({
                    "equipment_id": eq["id"],
                    "equipment_type": eq["type"],
                    "zone_id": z["id"],
                    "zone_name": z["name"],
                    "assigned_hours": round(hours, 1),
                    "expected_tonnes": int(round(tonnes)),
                    "redeployed": bool(pulp.value(y[eq["id"]]))
                })

    # Extract emergency overhaul decisions
    overhauls = []
    for eq in fleet:
        if eq["id"] in o and pulp.value(o[eq["id"]]) is not None and pulp.value(o[eq["id"]]) > 0.5:
            overhauls.append({
                "equipment_id": eq["id"],
                "equipment_type": eq["type"],
                "restored_tph": int(round(overhaul_restore_fraction * eq["capacity_tph"])),
                "expected_tonnes": int(round(pulp.value(b[eq["id"]]) or 0))
            })

    return {
        "solver_status": solver_status,
        "solve_time_ms": solve_time_ms,
        "objective_value": round(objective_value, 1),
        "total_recovered_tonnes": int(round(total_recovered)),
        "assignments": assignments,
        "num_variables": len(x) + len(y) + len(o) + len(b),
        "num_constraints": len(prob.constraints),
        "nodes_explored": nodes_explored,
        "overhauls": overhauls,
        "overhaul_units_available": len(o),
        "solver_engine": "COIN-OR CBC (Branch-and-Cut)",
        "is_genuine_milp": True
    }


class ActionService:
    def get_actions(
        self,
        scenario_id: str = "normal",
        mine_id: str = DEFAULT_MINE_ID,
        expected_gap: int = 1900,
        current_risk: float = 84.0
    ) -> Dict[str, Any]:
        """
        Compute optimal corrective interventions for a specific MOIL mine using PuLP MILP.
        """
        mine = MINES.get(mine_id, MINES[DEFAULT_MINE_ID])
        capacity = mine.get("capacity_tpd", 10000)

        shortfall = expected_gap if expected_gap > 0 else int(capacity * 0.18)

        # Get mine fleet and zones for MILP formulation
        fleet_raw = EQUIPMENT_FLEETS.get(mine_id, EQUIPMENT_FLEETS.get("gumgaon", []))
        fleet = [{
            "id": e["id"], "type": e["type"], "capacity_tph": e.get("capacity_tph", 300),
            "status": e.get("status", "OPERATIONAL"), "health": e.get("health", 100)
        } for e in fleet_raw]

        mine_zones = mine.get("zones", [])
        zones = [{"id": z["id"], "name": z["name"], "demand_t": shortfall * 0.6} for z in mine_zones[:3]] or [
            {"id": "primary-bench", "name": "Primary Extraction Bench", "demand_t": shortfall * 0.65},
            {"id": "secondary-bench", "name": "Secondary Ore Face", "demand_t": shortfall * 0.45}
        ]

        # Run genuine MILP solver
        milp_result = _solve_milp_dispatch(fleet, zones, shortfall, scenario_id)

        recovery_potential = milp_result["total_recovered_tonnes"]
        residual_risk = max(12, int(round(current_risk * (1.0 - recovery_potential / max(1, shortfall)))))

        # Generate human-readable dispatch instructions from solver output
        actions = []
        for i, assign in enumerate(milp_result["assignments"][:4]):
            urgency = "CRITICAL" if i == 0 else "HIGH" if i == 1 else "MEDIUM"
            actions.append({
                "priority": i + 1,
                "urgency": urgency,
                "title": "Redeploy %s to %s" % (assign["equipment_id"], assign["zone_name"]),
                "description": "MILP optimal assignment: Deploy %s for %.1f hours to %s. Expected throughput: %s TPH." % (
                    assign["equipment_type"], assign["assigned_hours"], assign["zone_name"],
                    next((e["capacity_tph"] for e in fleet if e["id"] == assign["equipment_id"]), 300)
                ),
                "impact": "Recover approximately %s T" % "{:,}".format(assign["expected_tonnes"]),
                "impactScore": max(60, 95 - i * 12),
                "feasibility": "HIGH"
            })

        # Add scenario-specific tactical actions
        if scenario_id == "equipment_failure":
            actions.append({
                "priority": len(actions) + 1,
                "urgency": "MEDIUM",
                "title": "Expedite Mobile Hydraulic Maintenance Crew",
                "description": "Authorize priority workshop overhaul on degraded excavator to restore rated TPH capacity.",
                "impact": "Restore full equipment availability within 6h",
                "impactScore": 65,
                "feasibility": "MEDIUM"
            })
        elif scenario_id == "heavy_rainfall":
            actions.append({
                "priority": len(actions) + 1,
                "urgency": "HIGH",
                "title": "Deploy High-Capacity Sump Pumps",
                "description": "Activate 1500 GPM dewatering skid pumps at lower benches to prevent pit flooding.",
                "impact": "Prevent further production loss from inundation",
                "impactScore": 90,
                "feasibility": "HIGH"
            })
        elif scenario_id == "blasting_delay":
            actions.append({
                "priority": len(actions) + 1,
                "urgency": "HIGH",
                "title": "Optimize Pre-Split Blast Timing Window",
                "description": "Advance detonation sequence to the immediate low-rainfall slot following DGMS inspection.",
                "impact": "Reduce bench fragmentation delay by 3h",
                "impactScore": 85,
                "feasibility": "HIGH"
            })

        if not actions:
            actions = [{
                "priority": 1,
                "urgency": "LOW",
                "title": "Maintain Optimal Bench Rotation at %s" % mine["name"],
                "description": "Continue standard extraction sequence across primary and secondary ore zones.",
                "impact": "Maintain 100%% Target Feed",
                "impactScore": 95,
                "feasibility": "HIGH"
            }]

        return {
            "mine_id": mine["id"],
            "mine_name": mine["name"],
            "scenario": scenario_id,
            "expected_gap": shortfall,
            "recovery_potential": recovery_potential,
            "current_risk": current_risk,
            "residual_risk": residual_risk,
            "actions": actions,
            "milp_solver": {
                "status": milp_result["solver_status"],
                "solve_time_ms": milp_result["solve_time_ms"],
                "objective_value": milp_result["objective_value"],
                "num_variables": milp_result["num_variables"],
                "num_constraints": milp_result["num_constraints"],
                "nodes_explored": milp_result["nodes_explored"],
                "overhauls": milp_result["overhauls"],
                "overhaul_units_available": milp_result["overhaul_units_available"],
                "engine": milp_result["solver_engine"],
                "assignments": milp_result["assignments"]
            },
            "is_genuine_milp": True
        }

action_service = ActionService()

