from fastapi import APIRouter, Query
from backend.services.forecast_service import forecast_service
from backend.services.satellite_service import fetch_live_satellite_data
from backend.config import DEFAULT_MINE_ID

router = APIRouter(prefix="/api/production", tags=["Production Forecast"])

@router.get("")
async def get_production_forecast(
    scenario: str = Query("normal", description="Operational Scenario"),
    mine_id: str = Query(DEFAULT_MINE_ID, description="MOIL Mine Identifier")
):
    """
    Get 14-day historical and 7-day predicted extraction tonnage for the specified mine and scenario.
    """
    sat_data = await fetch_live_satellite_data(mine_id=mine_id)
    return forecast_service.generate_forecast(
        scenario_id=scenario,
        mine_id=mine_id,
        satellite_data=sat_data
    )
