from fastapi import APIRouter, status
from typing import Optional
from pydantic import BaseModel

from services.marine_service import MarineService
from repos.marine_repo import MarineRepo
from services.ml_service import ml_service
from models.data_models import SpoilagePrediction

router = APIRouter()
repo = MarineRepo()
service = MarineService(repo)


# =====================================================
# 1️⃣ GET SPOILAGE PREDICTION BY BATCH
# =====================================================

@router.get("/spoilage/{batch_id}", response_model=SpoilagePrediction)
async def get_spoilage(batch_id: int):
    return await service.get_spoilage_by_batch(batch_id)


# =====================================================
# 2️⃣ SPOILAGE RISK EVALUATION (ML)
# =====================================================

class SpoilageRequest(BaseModel):
    catch_batch_id: int
    hours_since_catch: float
    hours_before_ice: float
    avg_storage_temp: float
    temp_variance: float
    species_shelf_life: float
    weight_kg: float


@router.post("/evaluate-spoilage")
async def evaluate_spoilage(req: SpoilageRequest):

    if not ml_service.is_ready():
        return {
            "success": False,
            "message": "ML model not available. Train it first."
        }

    # 🔥 Correct ML call
    result = ml_service.predict_spoilage(
        hours_since_catch=req.hours_since_catch,
        hours_before_ice=req.hours_before_ice,
        avg_storage_temp=req.avg_storage_temp,
        temp_variance=req.temp_variance,
        species_shelf_life=req.species_shelf_life,
        weight_kg=req.weight_kg,
    )

    # Save prediction to DB
    prediction = SpoilagePrediction(
        catch_batch_id=req.catch_batch_id,
        predicted_risk=result["predicted_risk"],
        confidence_score=result["confidence_score"],
        recommended_action=result["recommended_action"],
    )

    await service.create_spoilage_prediction(prediction)

    return {
        "success": True,
        "message": "Spoilage risk evaluated successfully",
        "data": result,
    }
class StatusUpdateRequest(BaseModel):
    status: str

@router.patch("/{batch_id}/status")
async def update_status(batch_id: int, req: StatusUpdateRequest):
    return await service.update_catch_status(batch_id, req.status)
