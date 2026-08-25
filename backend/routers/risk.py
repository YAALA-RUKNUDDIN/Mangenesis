from fastapi import APIRouter, Query
from backend.services.risk_service import risk_service
from backend.services.satellite_service import fetch_live_satellite_data
from backend.config import DEFAULT_MINE_ID

router = APIRouter(prefix="/api/risk", tags=["Risk Diagnostics"])

@router.get("")
async def get_risk_analysis(
    scenario: str = Query("normal", description="Operational Scenario"),
    mine_id: str = Query(DEFAULT_MINE_ID, description="MOIL Mine Identifier")
):
    """
    Get operational risk factor attribution (TreeSHAP) and telemetry signals for the specified mine.
    """
    sat_data = await fetch_live_satellite_data(mine_id=mine_id)
    return risk_service.get_risk_analysis(
        scenario_id=scenario,
        mine_id=mine_id,
        satellite_data=sat_data
    )
