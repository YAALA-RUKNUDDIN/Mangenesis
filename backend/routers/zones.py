from fastapi import APIRouter, Query
from backend.services.reserve_service import reserve_service
from backend.services.satellite_service import fetch_live_satellite_data
from backend.config import DEFAULT_MINE_ID

router = APIRouter(prefix="/api/zones", tags=["Reserve Intelligence"])

@router.get("")
async def get_reserve_zones(
    mine_id: str = Query(DEFAULT_MINE_ID, description="MOIL Mine Identifier")
):
    """
    Get AI-derived manganese reserve probabilities for all sectors in the specified mine.
    """
    sat_data = await fetch_live_satellite_data(mine_id=mine_id)
    zones = reserve_service.predict_zones(mine_id=mine_id, satellite_data=sat_data)
    return zones
