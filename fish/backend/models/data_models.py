from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime, date


class Vessel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[int] = None
    registration_number: str
    owner_name: str
    owner_phone: Optional[str] = None
    vessel_type: str
    capacity_kg: int
    home_port: str
    created_at: Optional[datetime] = None


class Species(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[int] = None
    name: str
    category: str
    avg_shelf_life_hours: int
    ideal_temp_min: float
    ideal_temp_max: float


class CatchBatch(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[int] = None
    vessel_id: int
    species_id: int
    catch_weight_kg: float
    catch_time: datetime
    landing_port: str
    ice_applied_time: Optional[datetime] = None
    quality_grade: Optional[str] = None
    current_status: str


class ColdStorageUnit(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[int] = None
    location: str
    max_capacity_kg: float
    current_load_kg: float
    current_temp: float


class TemperatureLog(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[int] = None
    storage_unit_id: int
    recorded_temp: float
    timestamp: datetime


class Auction(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[int] = None
    port: str
    auction_date: date
    base_price_per_kg: float
    recommended_price_per_kg: Optional[float] = None


class Bid(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[int] = None
    auction_id: int
    buyer_name: str
    bid_price_per_kg: float
    quantity_kg: float
    timestamp: datetime


class SpoilagePrediction(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[int] = None
    catch_batch_id: int
    predicted_risk: float
    confidence_score: float
    recommended_action: str
    created_at: Optional[datetime] = None


class NotificationLog(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[int] = None
    phone_number: str
    message_type: str
    message_body: str
    status: str
    created_at: Optional[datetime] = None
