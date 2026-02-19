from fastapi import APIRouter, status
from typing import List

from services.marine_service import MarineService
from repos.marine_repo import MarineRepo
from models.data_models import ColdStorageUnit, TemperatureLog

router = APIRouter()
repo = MarineRepo()
service = MarineService(repo)


# =====================================================
# 1️⃣ LIST STORAGE UNITS
# =====================================================

@router.get("/", response_model=List[ColdStorageUnit])
async def get_storage_units():
    """
    Retrieve all cold storage units.

    Includes:
    - location
    - max_capacity_kg
    - current_load_kg
    - current_temp
    """
    return await service.list_storage_units()


# =====================================================
# 2️⃣ CREATE STORAGE UNIT
# =====================================================

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=ColdStorageUnit,
)
async def create_storage_unit(storage: ColdStorageUnit):
    """
    Create a new cold storage unit.

    Required:
    - location
    - max_capacity_kg
    - current_load_kg
    - current_temp
    """
    return await service.create_storage_unit(storage)


# =====================================================
# 3️⃣ LOG TEMPERATURE
# =====================================================

@router.post(
    "/temperature",
    status_code=status.HTTP_201_CREATED,
    response_model=TemperatureLog,
)
async def log_temperature(temp: TemperatureLog):
    """
    Log temperature reading for a storage unit.

    Required:
    - storage_unit_id
    - recorded_temp
    - timestamp
    """
    return await service.log_temperature(temp)


# =====================================================
# 4️⃣ GET TEMPERATURE LOGS BY STORAGE UNIT
# =====================================================

@router.get("/{storage_id}/temperature")
async def get_temperature_logs(storage_id: int):
    return await service.get_temperature_logs(storage_id)
