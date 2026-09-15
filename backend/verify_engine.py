"""
MANGENESIS Engine Verification Suite (TDD regression harness)

Validates that all four AI engines are genuine, not simulated:

  1. Forecast  : LightGBM inference runs with correctly-named features (no
                 feature_names mismatch warnings) and returns 7 valid days.
  2. Risk/XAI  : TreeSHAP attributions are the *sole* source of driver
                 percentages/delta_tpd (no hand-tuned heuristics), Shapley
                 additivity holds (sum(phi) + E[f(x)] == f(x)), computation
                 time and tree depth are measured from the real model, and
                 shortfall risk is derived from model predictions.
  3. Reserve   : XGBoost probabilities are pure model output (no static
                 prior blending).
  4. Actions   : PuLP CBC MILP solves to OPTIMAL in < 120 ms, exposes the
                 emergency-overhaul binary decision variables, and node/-
                 iteration telemetry is parsed from the CBC log.
  5. API       : /api/production, /api/risk, /api/actions, /api/zones all
                 return 200 with genuine-engine flags set.

Run from repository root:  python backend/verify_engine.py
Exit code 0 = all checks green, 1 = at least one failure.
"""

import os
import sys
import warnings

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import joblib  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

from backend.config import MINES, SCENARIOS  # noqa: E402

RESULTS = []


def check(name: str, condition: bool, detail: str = ""):
    status = "PASS" if condition else "FAIL"
    RESULTS.append((name, bool(condition), detail))
    print(f"[{status}] {name}" + (f"  -- {detail}" if detail else ""))


# ---------------------------------------------------------------- helpers
MODEL_PATH = os.path.join(os.path.dirname(__file__), "trained_models", "forecast_lgbm.joblib")


def risk_feature_frame(scenario_id: str, mine_id: str) -> pd.DataFrame:
    """Reconstruct the deterministic feature vector RiskService builds."""
    mine = MINES.get(mine_id, MINES["gumgaon"])
    scenario = SCENARIOS.get(scenario_id, SCENARIOS["normal"])
    target = mine.get("capacity_tpd", 10000)
    rainfall = float(scenario["weather_override"]["rainfall_mm"])
    soil = float(scenario["weather_override"]["soil_moisture_pct"])
    downtime = float(scenario["equipment_downtime_hours"])
    blast_delay = float(scenario["blasting_delay_hours"])
    avail = max(40.0, min(98.0, 100.0 - (downtime / 24.0 * 100.0)))
    return pd.DataFrame([{
        "rainfall_mm": rainfall,
        "soil_moisture_pct": soil,
        "equipment_avail_pct": avail,
        "blasting_delay_hours": blast_delay,
        "target_tonnes": float(target),
        "day_of_week": 2,
        "rolling_7d_avg": float(target * 0.96),
    }])


def expected_shortfall_risk(predicted_tpd: float, target: float) -> float:
    gap = max(0.0, target - predicted_tpd)
    return round(min(98.0, max(5.0, (gap / target) * 320.0)), 1)


# ---------------------------------------------------------------- 1. Forecast
def test_forecast():
    from backend.services.forecast_service import forecast_service

    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        out = forecast_service.generate_forecast("equipment_failure", "gumgaon")
    mismatch = [w for w in caught if "feature_names mismatch" in str(w.message)]

    check("forecast: LightGBM inference active (is_genuine_ml)", out["is_genuine_ml"] is True)
    check("forecast: no feature-name mismatch warnings", len(mismatch) == 0,
          "; ".join(str(w.message) for w in mismatch[:1]))
    check("forecast: 7-day horizon returned", len(out["forecast"]) == 7)
    target = out["capacity_tpd"]
    lo, hi = target * 0.4, target * 1.25
    ok = all(lo <= d["predicted"] <= hi for d in out["forecast"])
    check("forecast: predictions physically bounded", ok,
          f"range [{min(d['predicted'] for d in out['forecast'])}, {max(d['predicted'] for d in out['forecast'])}]")


# ---------------------------------------------------------------- 2. Risk/XAI
def _tree_depth(node) -> int:
    if "split_feature" not in node:
        return 0
    return 1 + max(_tree_depth(node["left_child"]), _tree_depth(node["right_child"]))


def test_risk_shap():
    from backend.services.risk_service import risk_service

    out = risk_service.get_risk_analysis("heavy_rainfall", "gumgaon")
    check("risk: TreeSHAP explainer active (is_genuine_shap)", out["is_genuine_shap"] is True)

    model = joblib.load(MODEL_PATH)
    feat = risk_feature_frame("heavy_rainfall", "gumgaon")

    # Shapley additivity: sum(phi) + base == f(x)
    import shap
    explainer = shap.TreeExplainer(model)
    sv = explainer(feat)
    base = float(explainer.expected_value)
    pred = float(model.predict(feat)[0])
    additivity = float(np.sum(sv.values[0])) + base
    check("risk: Shapley additivity sum(phi)+E[f(x)] == f(x)",
          abs(additivity - pred) < max(1.0, abs(pred) * 1e-3),
          f"{additivity:.2f} vs {pred:.2f}")

    # Drivers must be pure TreeSHAP (delta_tpd == -round(max(0, -phi)))
    raw = dict(zip(feat.columns, [float(v) for v in sv.values[0]]))
    mapping = {
        "equipment_avail_pct": "Equipment Fleet Downtime",
        "soil_moisture_pct": "Haul Road Saturation (SMAP)",
        "rainfall_mm": "Precipitation & Inundation (GPM)",
        "blasting_delay_hours": "Blasting Clearance Delay",
    }
    total_adverse = sum(max(0.0, -raw[c]) for c in mapping)
    expected = {}
    for col, label in mapping.items():
        adverse = max(0.0, -raw[col])
        pct = int(round(adverse / max(total_adverse, 1e-9) * 100)) if total_adverse > 0 else 0
        if pct > 0:
            expected[label] = -int(round(adverse))
    actual = {d["name"]: d["delta_tpd"] for d in out["drivers"]}
    pure = actual == expected
    check("risk: driver deltas derived purely from TreeSHAP", pure,
          f"expected={expected} actual={actual}")

    # Measured metrics, not hardcoded
    m = out["shap_metrics"]
    dump = model.booster_.dump_model()
    real_depth = max(_tree_depth(t["tree_structure"]) for t in dump["tree_info"])
    check("risk: tree_depth measured from booster", m.get("tree_depth") == real_depth,
          f"reported={m.get('tree_depth')} actual={real_depth}")
    t = m.get("shapley_computation_time_ms")
    check("risk: shapley time is a measured float > 0",
          isinstance(t, (int, float)) and t > 0 and abs(t - 7.4) > 1e-9,
          f"reported={t}")

    # Shortfall risk computed from model prediction, not static config
    static = SCENARIOS["heavy_rainfall"]["shortfall_risk"]
    expected_risk = expected_shortfall_risk(pred, MINES["gumgaon"]["capacity_tpd"])
    check("risk: shortfall_risk derived from model prediction",
          out["shortfall_risk"] == expected_risk,
          f"reported={out['shortfall_risk']} expected={expected_risk} static_config={static}")


# ---------------------------------------------------------------- 3. Reserve
def test_reserve():
    from backend.services.reserve_service import reserve_service

    mine = MINES["gumgaon"]
    model = joblib.load(os.path.join(os.path.dirname(__file__), "trained_models", "reserve_xgb.joblib"))
    results = reserve_service.predict_zones("gumgaon", None)
    ok = True
    detail = ""
    for zone, res in zip(mine["zones"], results):
        feats = np.array([[
            zone.get("elevation_m", 300), zone.get("slope_deg", 10.0),
            zone.get("distance_to_known_deposit_km", 1.0), zone.get("drill_proximity_score", 0.8),
            0.34, 40.0, 32.0,
        ]])
        expected_prob = int(round(float(model.predict_proba(feats)[0][1]) * 100))
        if res["probability"] != expected_prob:
            ok = False
            detail = f"{res['name']}: reported={res['probability']} pure_model={expected_prob}"
            break
    check("reserve: probability is pure XGBoost output (no 70% prior blend)", ok, detail)


# ---------------------------------------------------------------- 4. MILP
def test_milp():
    from backend.services.action_service import _solve_milp_dispatch, action_service

    # Direct solver test where base capacity cannot cover demand -> overhaul
    # must be economically selected (binary o_i genuinely part of the model).
    fleet = [{"id": "EXC-04", "type": "Hydraulic Excavator", "capacity_tph": 450,
              "status": "DEGRADED", "health": 58}]
    zones = [{"id": "z1", "name": "Zone 1", "demand_t": 8000},
             {"id": "z2", "name": "Zone 2", "demand_t": 8000}]
    r = _solve_milp_dispatch(fleet, zones, 12000, "equipment_failure")
    check("milp: direct solve reaches OPTIMAL", r["solver_status"] == "Optimal", r["solver_status"])
    check("milp: overhaul telemetry keys exposed",
          "overhauls" in r and "overhaul_units_available" in r and "nodes_explored" in r)
    check("milp: CBC selects emergency overhaul when base capacity is insufficient",
          len(r.get("overhauls", [])) >= 1, f"overhauls={r.get('overhauls')}")

    # Service-level test
    out = action_service.get_actions("equipment_failure", "gumgaon", expected_gap=2200, current_risk=84.0)
    milp = out["milp_solver"]
    check("milp: service solve reaches OPTIMAL", milp["status"] == "Optimal", milp["status"])
    check("milp: solve time < 120 ms", milp["solve_time_ms"] < 120.0, f"{milp['solve_time_ms']} ms")
    check("milp: overhaul decision variables present in service response",
          "overhauls" in milp and "overhaul_units_available" in milp)


# ---------------------------------------------------------------- 5. API
def test_endpoints():
    from fastapi.testclient import TestClient
    from backend.main import app

    client = TestClient(app)

    r = client.get("/api/production?scenario=equipment_failure&mine_id=gumgaon")
    check("api: GET /api/production -> 200", r.status_code == 200)
    if r.status_code == 200:
        check("api: production is_genuine_ml", r.json().get("is_genuine_ml") is True)

    r = client.get("/api/risk?scenario=heavy_rainfall&mine_id=gumgaon")
    check("api: GET /api/risk -> 200", r.status_code == 200)
    if r.status_code == 200:
        check("api: risk is_genuine_shap", r.json().get("is_genuine_shap") is True)

    r = client.get("/api/actions?scenario=equipment_failure&mine_id=gumgaon")
    check("api: GET /api/actions -> 200", r.status_code == 200)
    if r.status_code == 200:
        check("api: actions is_genuine_milp", r.json().get("is_genuine_milp") is True)

    r = client.get("/api/zones?mine_id=gumgaon")
    check("api: GET /api/zones -> 200", r.status_code == 200)
    if r.status_code == 200:
        zones = r.json()
        probs = [z.get("probability", -1) for z in zones] if isinstance(zones, list) else []
        check("api: zone probabilities within [0, 100]",
              len(probs) > 0 and all(0 <= p <= 100 for p in probs), str(probs[:5]))


def main():
    print("=" * 72)
    print("MANGENESIS ENGINE VERIFICATION")
    print("=" * 72)
    tests = [test_forecast, test_risk_shap, test_reserve, test_milp, test_endpoints]
    for t in tests:
        print(f"\n--- {t.__name__} ---")
        try:
            t()
        except Exception as exc:  # noqa: BLE001
            check(f"{t.__name__}: no unhandled exception", False, f"{type(exc).__name__}: {exc}")

    print("\n" + "=" * 72)
    failed = [name for name, ok, _ in RESULTS if not ok]
    print(f"RESULT: {len(RESULTS) - len(failed)}/{len(RESULTS)} checks passed")
    if failed:
        print("FAILED CHECKS:")
        for name in failed:
            print(f"  - {name}")
        sys.exit(1)
    print("ALL ENGINE CHECKS GREEN - no simulated algorithm fragments remain.")
    sys.exit(0)


if __name__ == "__main__":
    main()

