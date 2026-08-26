"""
MANGENESIS - ROI & Cost-Benefit API Router
Endpoints for financial impact analysis.
"""

from fastapi import APIRouter, Query
from backend.services.roi_service import compute_roi_metrics, compute_multi_mine_roi

router = APIRouter(prefix="/api/roi", tags=["ROI & Cost-Benefit"])


@router.get("/single")
async def get_single_mine_roi(
    mine_id: str = Query("gumgaon", description="Mine ID"),
    scenario_id: str = Query("equipment_failure", description="Scenario ID"),
):
    """Compute ROI metrics for a single mine under a given scenario."""
    return compute_roi_metrics(mine_id, scenario_id)


@router.get("/enterprise")
async def get_enterprise_roi():
    """Compute aggregated ROI across all 6 MOIL mines."""
    return compute_multi_mine_roi()
