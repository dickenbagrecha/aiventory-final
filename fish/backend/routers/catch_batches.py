from fastapi import APIRouter, status
from typing import List, Optional

from services.marine_service import MarineService
from repos.marine_repo import MarineRepo
from models.data_models import CatchBatch

router = APIRouter()
repo = MarineRepo()
service = MarineService(repo)


# =====================================================
# 1️⃣ GET CATCH BATCHES
# =====================================================

@router.get("/", response_model=List[CatchBatch])
async def get_catch_batches(current_status: Optional[str] = None):
    """
    Retrieve catch batches.

    Optional query parameter:
    - current_status (e.g., stored, auctioned, transported, spoiled)
    """
    return await service.get_catch_batches(current_status)


# =====================================================
# 2️⃣ CREATE CATCH BATCH
# =====================================================

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=CatchBatch,
)
async def create_catch_batch(batch: CatchBatch):
    """
    Create a new catch batch.

    Required:
    - vessel_id
    - species_id
    - catch_weight_kg
    - catch_time
    - landing_port
    - current_status

    Optional:
    - ice_applied_time
    - quality_grade
    """
    return await service.create_catch_batch(batch)


# =====================================================
# 3️⃣ UPDATE CATCH STATUS
# =====================================================

@router.patch(
    "/{batch_id}/status",
    status_code=status.HTTP_200_OK,
)
@router.patch("/{batch_id}/status")
async def update_status(batch_id: int, status: str):
    return await service.update_catch_status(batch_id, status)

