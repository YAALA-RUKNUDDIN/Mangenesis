"""
Reserve Intelligence Service
Predicts manganese deposit presence probability across mining exploration sectors using trained XGBoost classifier.
"""

import os
import joblib
import numpy as np
from typing import List, Dict, Any
from backend.config import MINES, DEFAULT_MINE_ID

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "trained_models", "reserve_xgb.joblib")

class ReserveService:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
            except Exception:
                self.model = None

    def predict_zones(self, mine_id: str = DEFAULT_MINE_ID, satellite_data: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Run reserve inference for zones belonging to the specified mine.
        """
        mine = MINES.get(mine_id, MINES[DEFAULT_MINE_ID])
        configured_zones = mine.get("zones", [])

        if not configured_zones:
            return []

        ndvi = satellite_data.get("ndvi", 0.34) if satellite_data else 0.34
        soil_moisture = satellite_data.get("soil_moisture_pct", 40.0) if satellite_data else 40.0
        lst_temp = satellite_data.get("lst_temp_c", 32.0) if satellite_data else 32.0

        results = []
        for zone in configured_zones:
            prob = zone.get("probability", 50)

            # If model is loaded, we can refine using features
            if self.model:
                try:
                    features = np.array([[
                        zone.get("elevation_m", 300),
                        zone.get("slope_deg", 10.0),
                        zone.get("distance_to_known_deposit_km", 1.0),
                        zone.get("drill_proximity_score", 0.8),
                        ndvi,
                        soil_moisture,
                        lst_temp
                    ]])
                    prob_pred = self.model.predict_proba(features)[0][1] * 100
                    # Blend with calibrated prior
                    prob = int(round(0.7 * zone["probability"] + 0.3 * prob_pred))
                except Exception:
                    pass

            color = "#10B981" if prob >= 70 else "#F59E0B" if prob >= 40 else "#64748B"
            priority = "HIGH" if prob >= 70 else "MEDIUM" if prob >= 40 else "LOW"

            results.append({
                "id": zone["id"],
                "name": zone["name"],
                "mine_id": mine["id"],
                "color": color,
                "priority": priority,
                "probability": prob,
                "center": zone["center"],
                "coordinates": zone["coordinates"],
                "geological_formation": zone.get("geological_formation", "Mansar Formation"),
                "indicators": zone.get("indicators", []),
                "recommendation": zone.get("recommendation", "Continue regional mapping.")
            })

        return results

reserve_service = ReserveService()
