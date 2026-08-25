-- MANGENESIS AI — Supabase PostgreSQL + PostGIS Database Schema
-- Execute this SQL script in your Supabase SQL Editor (https://app.supabase.com)

-- 1. Enable PostGIS Extension for Space & Mine Coordinates
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. MOIL Mines Table
CREATE TABLE IF NOT EXISTS public.mines (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location_name VARCHAR(100),
    state VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    capacity_tpd INT NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    is_pilot BOOLEAN DEFAULT FALSE,
    geological_formation VARCHAR(100),
    ore_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Diamond Drill Core Assay Table
CREATE TABLE IF NOT EXISTS public.drill_points (
    id VARCHAR(50) PRIMARY KEY,
    mine_id VARCHAR(50) REFERENCES public.mines(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    depth_m DOUBLE PRECISION NOT NULL,
    mn_grade_pct DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) DEFAULT 'COMMERCIAL ORE',
    zone_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Manganese Reserve Probability Zones Table
CREATE TABLE IF NOT EXISTS public.reserve_zones (
    id SERIAL PRIMARY KEY,
    zone_id VARCHAR(50) NOT NULL,
    mine_id VARCHAR(50) REFERENCES public.mines(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    probability_pct INT NOT NULL,
    area_sqkm DOUBLE PRECISION NOT NULL,
    est_reserve_tonnes INT NOT NULL,
    mn_grade_avg DOUBLE PRECISION NOT NULL,
    depth_range_m VARCHAR(50),
    geological_unit VARCHAR(100),
    confidence_tier VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Daily Production Telemetry & Forecasts
CREATE TABLE IF NOT EXISTS public.production_logs (
    id SERIAL PRIMARY KEY,
    mine_id VARCHAR(50) REFERENCES public.mines(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    target_tonnes INT NOT NULL,
    actual_tonnes INT NOT NULL,
    shortfall_tonnes INT DEFAULT 0,
    scenario_type VARCHAR(50) DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Realtime Production Shortfall & Mitigation Alerts
CREATE TABLE IF NOT EXISTS public.shortfall_alerts (
    id SERIAL PRIMARY KEY,
    mine_id VARCHAR(50) REFERENCES public.mines(id) ON DELETE CASCADE,
    alert_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    risk_score INT NOT NULL,
    primary_cause VARCHAR(255) NOT NULL,
    recovery_tonnes INT NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.mines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drill_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserve_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortfall_alerts ENABLE ROW LEVEL SECURITY;

-- 8. Allow Full Read & Write Access (CRUD)
DROP POLICY IF EXISTS "Allow All Access Mines" ON public.mines;
CREATE POLICY "Allow All Access Mines" ON public.mines FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Access Drill Points" ON public.drill_points;
CREATE POLICY "Allow All Access Drill Points" ON public.drill_points FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Access Reserve Zones" ON public.reserve_zones;
CREATE POLICY "Allow All Access Reserve Zones" ON public.reserve_zones FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Access Production Logs" ON public.production_logs;
CREATE POLICY "Allow All Access Production Logs" ON public.production_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Access Shortfall Alerts" ON public.shortfall_alerts;
CREATE POLICY "Allow All Access Shortfall Alerts" ON public.shortfall_alerts FOR ALL USING (true) WITH CHECK (true);
