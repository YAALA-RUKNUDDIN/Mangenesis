"""
MANGENESIS Database Layer
SQLite database managing zones, production history, fleet telemetry, and satellite caches.
"""
import sqlite3
import json
import os
from datetime import datetime, timedelta
from backend.config import ZONE_CONFIGS, EQUIPMENT_FLEET, DAILY_TARGET_TONNES

DB_PATH = os.path.join(os.path.dirname(__file__), "mangenesis.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Create tables and populate seed data if database is new."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Zones Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS zones (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            geological_formation TEXT,
            elevation_m REAL,
            slope_deg REAL,
            distance_to_known_deposit_km REAL,
            drill_proximity_score REAL,
            coordinates_json TEXT,
            center_json TEXT
        )
    """)

    # 2. Production History Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS production_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date_str TEXT UNIQUE,
            day_offset INTEGER,
            actual_tonnes REAL,
            target_tonnes REAL,
            rainfall_mm REAL,
            soil_moisture_pct REAL,
            equipment_availability_pct REAL,
            blast_delay_hours REAL
        )
    """)

    # 3. Equipment Telemetry Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS equipment (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            capacity_tph REAL,
            current_zone TEXT,
            status TEXT,
            downtime_hours REAL,
            last_maintenance_date TEXT
        )
    """)

    # 4. Satellite Live Cache Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS satellite_cache (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            timestamp TEXT,
            rainfall_mm REAL,
            soil_moisture_pct REAL,
            ndvi REAL,
            lst_temp_c REAL,
            raw_json TEXT
        )
    """)

    conn.commit()

    # Seed Zones if empty
    cursor.execute("SELECT COUNT(*) FROM zones")
    if cursor.fetchone()[0] == 0:
        for z in ZONE_CONFIGS:
            cursor.execute("""
                INSERT INTO zones (id, name, geological_formation, elevation_m, slope_deg, distance_to_known_deposit_km, drill_proximity_score, coordinates_json, center_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                z["id"],
                z["name"],
                z["geological_formation"],
                z["elevation_m"],
                z["slope_deg"],
                z["distance_to_known_deposit_km"],
                z["drill_proximity_score"],
                json.dumps(z["coordinates"]),
                json.dumps(z["center"])
            ))

    # Seed Equipment if empty
    cursor.execute("SELECT COUNT(*) FROM equipment")
    if cursor.fetchone()[0] == 0:
        for eq in EQUIPMENT_FLEET:
            cursor.execute("""
                INSERT INTO equipment (id, type, capacity_tph, current_zone, status, downtime_hours, last_maintenance_date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                eq["id"],
                eq["type"],
                eq["capacity_tph"],
                eq["zone"],
                eq["status"],
                6.2 if eq["id"] == "EXC-04" else 0.0,
                "2026-08-10"
            ))

    # Seed 14-day production history if empty
    cursor.execute("SELECT COUNT(*) FROM production_records")
    if cursor.fetchone()[0] == 0:
        base_date = datetime(2026, 8, 18)
        # Past 14 days values
        hist_values = [9800, 9650, 10100, 9900, 9750, 10050, 9400, 9600, 9850, 9500, 9200, 8900, 8600, 8200]
        for idx, actual in enumerate(hist_values):
            d_offset = -14 + idx
            rec_date = (base_date + timedelta(days=d_offset)).strftime("%b %d")
            cursor.execute("""
                INSERT OR IGNORE INTO production_records (date_str, day_offset, actual_tonnes, target_tonnes, rainfall_mm, soil_moisture_pct, equipment_availability_pct, blast_delay_hours)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                rec_date,
                d_offset,
                actual,
                DAILY_TARGET_TONNES,
                15.0 + (idx * 2.3),
                45.0 + (idx * 1.8),
                92.0 - (idx * 1.1),
                0.0 if idx < 10 else 4.5
            ))

    conn.commit()
    conn.close()
    print("Database initialized successfully.")

if __name__ == "__main__":
    init_db()
