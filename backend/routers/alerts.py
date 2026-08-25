from fastapi import APIRouter
from typing import Dict, Any, List
from pydantic import BaseModel
from backend.services import alert_service

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

class TestAlertRequest(BaseModel):
    channel: alert_service.AlertChannel

class EvaluateRequest(BaseModel):
    scenario_data: Dict[str, Any]

@router.get("/config", response_model=alert_service.AlertConfig)
async def get_config():
    return alert_service.get_config()

@router.put("/config", response_model=alert_service.AlertConfig)
async def update_config(config: alert_service.AlertConfig):
    return alert_service.update_config(config)

@router.post("/test")
async def send_test_alert(req: TestAlertRequest):
    return alert_service.send_test_alert(req.channel)

@router.get("/history")
async def get_history():
    return alert_service.get_alert_history()

@router.post("/evaluate")
async def evaluate_alert(req: EvaluateRequest):
    res = alert_service.evaluate_and_alert(req.scenario_data)
    if res:
        return {"status": "alert_triggered", "alert": res}
    return {"status": "no_alert_needed"}

@router.get("/push")
async def get_push_notifications():
    return {"notifications": alert_service.get_pending_push_notifications()}
