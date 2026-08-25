from fastapi import APIRouter, Query
from backend.services.satellite_service import fetch_live_satellite_data
from backend.config import DEFAULT_MINE_ID

router = APIRouter(prefix="/api/satellite", tags=["Satellite"])

@router.get("/live")
async def get_live_satellite(
    mine_id: str = Query(DEFAULT_MINE_ID, description="MOIL Mine Identifier")
):
    """
    Get live satellite meteorological and remote sensing observations for a specific MOIL mine.
    """
    data = await fetch_live_satellite_data(mine_id=mine_id)
    return data
