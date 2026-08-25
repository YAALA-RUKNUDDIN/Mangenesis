"""
Mines Registry Router
Returns list and details of all integrated MOIL manganese mines.
"""

from fastapi import APIRouter
from typing import List, Dict, Any
from backend.config import MINES

router = APIRouter(prefix="/api/mines", tags=["Mines"])

@router.get("", response_model=List[Dict[str, Any]])
async def get_all_mines():
    """
    Get registry of all MOIL manganese mines supported by MANGENESIS platform,
    including their GIS zones, diamond drill assay points, and haulage road networks.
    """
    mines_list = []
    for m in MINES.values():
        mines_list.append({
            "id": m["id"],
            "name": m["name"],
            "pilot": m.get("pilot", False),
            "district": m.get("district", "Nagpur"),
            "state": m.get("state", "Maharashtra"),
            "lat": m["lat"],
            "lon": m["lon"],
            "center": [m["lat"], m["lon"]],
            "zoom": 14,
            "type": m["type"],
            "capacity_tpd": m["capacity_tpd"],
            "elevation_m": m["elevation_m"],
            "geological_formation": m["geological_formation"],
            "mineralization_trend": m["mineralization_trend"],
            "description": m["description"],
            "zones": m.get("zones", []),
            "drill_points": m.get("drill_points", []),
            "roads": m.get("roads", [])
        })
    return mines_list
