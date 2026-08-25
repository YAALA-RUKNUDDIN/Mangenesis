from fastapi import APIRouter
from backend.services.supabase_service import get_supabase_status, seed_supabase_tables

router = APIRouter(prefix="/api/supabase", tags=["Supabase Cloud Database"])

@router.get("/status")
def supabase_status():
    """Returns the current connection & schema status of Supabase PostgreSQL."""
    return get_supabase_status()

@router.post("/seed")
def seed_database():
    """Seeds the Supabase database with all 6 MOIL mines, drill core assays, and reserve zones."""
    return seed_supabase_tables()
