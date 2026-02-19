from fastapi import APIRouter, status
from typing import List

from services.marine_service import MarineService
from repos.marine_repo import MarineRepo
from models.data_models import Species

router = APIRouter()
repo = MarineRepo()
service = MarineService(repo)


# =====================================================
# 1️⃣ LIST SPECIES
# =====================================================

@router.get("/", response_model=List[Species])
async def get_species():
    """
    Retrieve all fish species.

    Includes:
    - name
    - category
    - avg_shelf_life_hours
    - ideal_temp_min
    - ideal_temp_max
    """
    return await service.list_species()


# =====================================================
# 2️⃣ CREATE SPECIES
# =====================================================

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=Species,
)
async def create_species(species: Species):
    """
    Create a new fish species.

    Required:
    - name
    - category
    - avg_shelf_life_hours
    - ideal_temp_min
    - ideal_temp_max
    """
    return await service.create_species(species)
