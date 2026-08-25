"""
MANGENESIS - AI-Powered Space Intelligence for Manganese Reserve Identification & Production Continuity
FastAPI Backend Application Entrypoint
Ministry of Steel | MOIL Ltd. | Problem Statement: SIH26009
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import satellite, zones, production, risk, actions, mines, supabase_router, alerts
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Train models on startup if artifacts not present
    reserve_model = os.path.join(os.path.dirname(__file__), "trained_models", "reserve_xgb.joblib")
    forecast_model = os.path.join(os.path.dirname(__file__), "trained_models", "forecast_lgbm.joblib")
    if not os.path.exists(reserve_model) or not os.path.exists(forecast_model):
        train_all_models()
    print(">> MANGENESIS MOIL Multi-Mine AI Platform Online & Ready.")
    yield

app = FastAPI(
    title="MANGENESIS Platform API",
    description="Scalable Multi-Mine Space Intelligence & AI Engine for Manganese Reserve Identification and Production Continuity (MOIL Ltd.)",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Middleware to allow React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All Routers
app.include_router(mines.router)
app.include_router(satellite.router)
app.include_router(zones.router)
app.include_router(production.router)
app.include_router(risk.router)
app.include_router(actions.router)
app.include_router(supabase_router.router)
app.include_router(alerts.router)

@app.get("/")
async def root():
    return {
        "platform": "MANGENESIS",
        "description": "AI-Powered Space Intelligence for Manganese Reserve Identification and Production Continuity",
        "organization": "Ministry of Steel — MOIL Ltd.",
        "problem_statement": "SIH26009",
        "status": "ONLINE",
        "supported_mines": ["gumgaon", "balaghat", "dongri_buzurg", "kandri", "chikla", "tirodi"],
        "docs_url": "/docs"
    }
