from pathlib import Path
from typing import Dict

import joblib
import pandas as pd
import numpy as np


# Resolve backend root
BACKEND_DIR = Path(__file__).resolve().parents[1]
ML_DIR = BACKEND_DIR / "ml"

MODEL_PATH = ML_DIR / "spoilage_model.pkl"
SCALER_PATH = ML_DIR / "spoilage_scaler.pkl"


class MLService:
    def __init__(self):
        self.model = None
        self.scaler = None

        print(f"[ML] Service initialized from: {__file__}")
        print(f"[ML] Looking for model at: {MODEL_PATH}")
        print(f"[ML] Looking for scaler at: {SCALER_PATH}")

        try:
            if MODEL_PATH.exists() and SCALER_PATH.exists():
                self.model = joblib.load(MODEL_PATH)
                self.scaler = joblib.load(SCALER_PATH)
                print("[ML] Spoilage model and scaler loaded successfully.")
            else:
                print("[ML] Model or scaler not found. Train model first.")
        except Exception as e:
            print(f"[ML] Error loading ML components: {e}")

    def is_ready(self) -> bool:
        return self.model is not None and self.scaler is not None

    # ======================================================
    # SPOILAGE RISK PREDICTION
    # ======================================================

    def predict_spoilage(
        self,
        hours_since_catch: float,
        hours_before_ice: float,
        avg_storage_temp: float,
        temp_variance: float,
        species_shelf_life: float,
        weight_kg: float,
    ) -> Dict:

        if not self.is_ready():
            raise RuntimeError("Spoilage ML model not loaded")

        # Build dataframe EXACTLY matching training columns
        df = pd.DataFrame(
            [
                {
                    "hours_since_catch": hours_since_catch,
                    "hours_before_ice": hours_before_ice,
                    "avg_storage_temp": avg_storage_temp,
                    "temp_variance": temp_variance,
                    "species_shelf_life": species_shelf_life,
                    "weight_kg": weight_kg,
                }
            ]
        )

        print("[ML] Prediction input:")
        print(df)

        # Scale
        X_scaled = self.scaler.transform(df)

        # Predict
        predicted_risk = float(self.model.predict(X_scaled)[0])

        # Clamp safety
        predicted_risk = max(0.0, min(1.0, predicted_risk))

        # Simple confidence proxy
        confidence_score = round(1 - abs(predicted_risk - 0.5), 3)

        # Action logic
        if predicted_risk >= 0.85:
            action = "Immediate auction or discard"
        elif predicted_risk >= 0.7:
            action = "Fast-track to auction"
        elif predicted_risk >= 0.5:
            action = "Increase monitoring frequency"
        else:
            action = "Safe for storage"

        return {
            "predicted_risk": round(predicted_risk, 4),
            "confidence_score": confidence_score,
            "recommended_action": action,
        }


# Shared instance
ml_service = MLService()
