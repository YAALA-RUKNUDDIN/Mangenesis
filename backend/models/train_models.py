"""
MANGENESIS Model Training Script
Trains:
1. XGBoost Reserve Probability Classifier
2. LightGBM Production Shortfall Forecast Regressor
Saves artifacts to backend/trained_models/
"""
import os
import numpy as np
import pandas as pd
import joblib
from xgboost import XGBClassifier
from lightgbm import LGBMRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, r2_score

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "trained_models")
os.makedirs(MODELS_DIR, exist_ok=True)

def train_reserve_model():
    print("Training XGBoost Reserve Exploration Classifier...")
    np.random.seed(42)
    n_samples = 4000

    elevation = np.random.uniform(220, 420, n_samples)
    slope = np.random.uniform(3, 20, n_samples)
    dist_deposit = np.random.uniform(0.2, 4.5, n_samples)
    drill_proximity = np.random.uniform(0.1, 0.95, n_samples)
    ndvi = np.random.uniform(0.2, 0.6, n_samples)
    soil_moisture = np.random.uniform(35, 85, n_samples)
    lst_temp = np.random.uniform(26, 44, n_samples)

    # Mineral presence logit
    z = (
        - 0.8 * dist_deposit
        + 3.5 * drill_proximity
        + 1.8 * ndvi
        - 0.05 * (lst_temp - 32)**2
        + np.random.normal(0, 0.5, n_samples)
    )
    prob = 1 / (1 + np.exp(-z))
    y = (prob > 0.5).astype(int)

    X = np.column_stack([elevation, slope, dist_deposit, drill_proximity, ndvi, soil_moisture, lst_temp])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.08,
        eval_metric="logloss",
        random_state=42
    )
    model.fit(X_train, y_train)

    preds = model.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, preds)
    print(f"XGBoost Reserve Model Trained! Test AUC: {auc:.4f}")

    joblib.dump(model, os.path.join(MODELS_DIR, "reserve_xgb.joblib"))
    print("Saved reserve_xgb.joblib successfully.")

def train_forecast_model():
    print("Training LightGBM Production Forecast Regressor...")
    np.random.seed(42)
    n_samples = 3000

    rainfall = np.random.exponential(15, n_samples)
    soil_moisture = np.clip(30 + rainfall * 0.6 + np.random.normal(0, 5, n_samples), 20, 95)
    equipment_downtime = np.random.exponential(2, n_samples)
    blasting_delay = np.random.exponential(1, n_samples)
    target = np.random.choice([6000, 7500, 8000, 10000, 12000, 14000], n_samples)
    day_of_week = np.random.randint(0, 7, n_samples)
    rolling_7d_avg = target + np.random.normal(0, 200, n_samples)

    loss_factor = (
        0.003 * rainfall
        + 0.04 * equipment_downtime
        + 0.02 * blasting_delay
        + (0.002 * (soil_moisture - 40) if np.mean(soil_moisture) > 40 else 0)
    )
    loss_factor = np.clip(loss_factor, 0, 0.45)
    actual_tonnes = target * (1 - loss_factor) + np.random.normal(0, 150, n_samples)

    X = pd.DataFrame({
        "rainfall_mm": rainfall,
        "soil_moisture_pct": soil_moisture,
        "equipment_downtime_hours": equipment_downtime,
        "blasting_delay_hours": blasting_delay,
        "target_tonnes": target,
        "day_of_week": day_of_week,
        "rolling_7d_avg": rolling_7d_avg
    })

    y = actual_tonnes
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LGBMRegressor(
        n_estimators=150,
        max_depth=5,
        learning_rate=0.06,
        num_leaves=31,
        random_state=42,
        verbose=-1
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    r2 = r2_score(y_test, preds)
    print(f"LightGBM Forecast Model Trained! Test R²: {r2:.4f}")

    joblib.dump(model, os.path.join(MODELS_DIR, "forecast_lgbm.joblib"))
    print("Saved forecast_lgbm.joblib successfully.")

def train_all_models():
    train_reserve_model()
    train_forecast_model()

if __name__ == "__main__":
    train_all_models()
