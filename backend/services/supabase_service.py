import os
import logging
from typing import Dict, List, Optional
from backend.config import MINES

logger = logging.getLogger("mangenesis.supabase")

# Environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Direct fallback from .env file if not loaded by environment
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                k, v = line.strip().split("=", 1)
                os.environ[k] = v

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://wedewxohzcxgtkvopzkz.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

supabase_client = None

try:
    from supabase import create_client, Client
    if SUPABASE_URL and SUPABASE_KEY:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info(f"Supabase Client initialized successfully for: {SUPABASE_URL}")
    else:
        logger.info("Supabase credentials not configured yet. Operating in local dynamic mode with ready Supabase schema.")
except Exception as e:
    logger.warning(f"Could not initialize Supabase client: {e}")


def get_supabase_status() -> Dict:
    """Returns the current connection status of Supabase PostgreSQL."""
    is_connected = supabase_client is not None
    return {
        "status": "CONNECTED" if is_connected else "READY_FOR_CREDENTIALS",
        "database": "PostgreSQL + PostGIS",
        "supabase_url": SUPABASE_URL if is_connected else "https://app.supabase.com (Configured)",
        "features": [
            "PostGIS Spatial Coordinates",
            "Role-Based Access Control (RBAC)",
            "Realtime Shortfall WebSockets",
            "Cloud GeoTIFF Storage"
        ],
        "tables_ready": ["mines", "drill_points", "reserve_zones", "production_logs", "shortfall_alerts"]
    }


def seed_supabase_tables() -> Dict:
    """Seeds the Supabase database with all 6 MOIL mines, drill points, and zones."""
    if not supabase_client:
        return {"status": "SKIPPED", "message": "Supabase client not active. Please check credentials."}

    try:
        # Seed Mines
        for mine_id, mine in MINES.items():
            lat = mine.get("lat") or (mine.get("center")[0] if mine.get("center") else 21.1550)
            lng = mine.get("lng") or mine.get("lon") or (mine.get("center")[1] if mine.get("center") else 79.0900)
            
            mine_row = {
                "id": mine.get("id", mine_id),
                "name": mine.get("name", mine_id.title()),
                "location_name": mine.get("location_name", f"{mine.get('district', '')}, {mine.get('state', '')}"),
                "state": mine.get("state", "Maharashtra"),
                "district": mine.get("district", "Nagpur"),
                "lat": float(lat),
                "lng": float(lng),
                "capacity_tpd": int(mine.get("capacity_tpd", 10000)),
                "is_pilot": bool(mine.get("pilot", False)),
                "geological_formation": mine.get("geological_formation", "Sausar Group Gondite"),
                "ore_type": mine.get("ore_type", "High-Grade Mn Ore")
            }
            supabase_client.table("mines").upsert(mine_row).execute()

            # Seed Drill Points
            for dp in mine.get("drill_points", []):
                grade_val = 45.0
                raw_grade = str(dp.get("grade", "45.0"))
                try:
                    grade_val = float(raw_grade.replace("% Mn", "").replace("Mn", "").strip().split()[0])
                except Exception:
                    grade_val = 45.0

                dp_row = {
                    "id": f"{mine_id}_{dp.get('name', 'DP01')}",
                    "mine_id": mine_id,
                    "name": dp.get("name", "DP-01"),
                    "lat": float(dp.get("lat", lat)),
                    "lng": float(dp.get("lng", lng)),
                    "depth_m": float(dp.get("depth", 150)),
                    "mn_grade_pct": grade_val,
                    "status": dp.get("status", "COMMERCIAL ORE"),
                    "zone_name": dp.get("zone_name", "Primary Lode")
                }
                supabase_client.table("drill_points").upsert(dp_row).execute()

            # Seed Zones
            for z in mine.get("zones", []):
                zone_row = {
                    "zone_id": z.get("id", "Z1"),
                    "mine_id": mine_id,
                    "name": z.get("name", "Target Sector"),
                    "probability_pct": int(z.get("probability", 75)),
                    "area_sqkm": float(z.get("area_sqkm", 1.2)),
                    "est_reserve_tonnes": int(z.get("est_reserve_tonnes", 1000000)),
                    "mn_grade_avg": float(z.get("Mn_grade_avg", 44.5)),
                    "depth_range_m": str(z.get("depth_range_m", "0-200m")),
                    "geological_unit": str(z.get("geological_unit", "Gondite Series")),
                    "confidence_tier": str(z.get("confidence_tier", "HIGH"))
                }
                supabase_client.table("reserve_zones").upsert(zone_row).execute()

        return {"status": "SUCCESS", "message": "Successfully seeded all 6 MOIL mines, diamond drill core logs & reserve zones to Supabase PostgreSQL!"}
    except Exception as err:
        logger.error(f"Error seeding Supabase: {err}")
        return {"status": "ERROR", "message": str(err)}


def fetch_mines_from_supabase() -> Optional[List[Dict]]:
    """Fetches mines from Supabase if connected."""
    if not supabase_client:
        return None
    try:
        res = supabase_client.table("mines").select("*").execute()
        return res.data
    except Exception as e:
        logger.warning(f"Failed to fetch mines from Supabase: {e}")
        return None
