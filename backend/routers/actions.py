from fastapi import APIRouter, Query
from backend.services.action_service import action_service
from backend.services.forecast_service import forecast_service
from backend.services.satellite_service import fetch_live_satellite_data
from backend.config import DEFAULT_MINE_ID

router = APIRouter(prefix="/api/actions", tags=["Action Center"])

@router.get("")
async def get_corrective_actions(
    scenario: str = Query("normal", description="Operational Scenario"),
    mine_id: str = Query(DEFAULT_MINE_ID, description="MOIL Mine Identifier")
):
    """
    Get MILP-optimized corrective action interventions for the specified mine.
    """
    sat_data = await fetch_live_satellite_data(mine_id=mine_id)
    forecast_data = forecast_service.generate_forecast(
        scenario_id=scenario,
        mine_id=mine_id,
        satellite_data=sat_data
    )
    return action_service.get_actions(
        scenario_id=scenario,
        mine_id=mine_id,
        expected_gap=forecast_data["expected_gap"],
        current_risk=forecast_data["shortfall_risk"]
    )
