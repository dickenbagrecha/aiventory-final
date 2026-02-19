from fastapi import APIRouter, status
from typing import List

from services.marine_service import MarineService
from repos.marine_repo import MarineRepo
from models.data_models import Vessel

router = APIRouter()
repo = MarineRepo()
service = MarineService(repo)


# =====================================================
# 1️⃣ LIST VESSELS
# =====================================================

@router.get("/", response_model=List[Vessel])
async def get_vessels():
    """
    Retrieve all registered fishing vessels.

    Includes:
    - registration_number
    - owner_name
    - owner_phone
    - vessel_type
    - capacity_kg
    - home_port
    - created_at
    """
    return await service.list_vessels()


# =====================================================
# 2️⃣ CREATE VESSEL
# =====================================================

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=Vessel,
)
async def create_vessel(vessel: Vessel):
    """
    Register a new fishing vessel.

    Required:
    - registration_number
    - owner_name
    - vessel_type
    - capacity_kg
    - home_port

    Optional:
    - owner_phone
    """
    return await service.create_vessel(vessel)


# =====================================================
# 3️⃣ DELETE VESSEL
# =====================================================

@router.delete(
    "/{vessel_id}",
    status_code=status.HTTP_200_OK,
)
async def delete_vessel(vessel_id: str):
    """
    Delete a vessel by ID.
    """
    return await service.delete_vessel(vessel_id)
