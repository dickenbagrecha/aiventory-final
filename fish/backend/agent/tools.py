from typing import Dict, Optional, List
from datetime import datetime
from statistics import mean

from services.marine_service import MarineService
from repos.marine_repo import MarineRepo
from models.data_models import (
    Vessel,
    Species,
    CatchBatch,
)

repo = MarineRepo()
service = MarineService(repo)


# ===================================================
# UTIL
# ===================================================

def normalize_dt(dt):
    if dt is None:
        return None
    if isinstance(dt, str):
        return datetime.fromisoformat(dt)
    return dt


# ===================================================
# VESSELS
# ===================================================

async def register_vessel(
    registration_number: str,
    owner_name: str,
    vessel_type: str,
    capacity_kg: int,
    home_port: str,
    owner_phone: Optional[str] = None
) -> Dict:
    try:
        vessel = Vessel(
            registration_number=registration_number,
            owner_name=owner_name,
            vessel_type=vessel_type,
            capacity_kg=capacity_kg,
            home_port=home_port,
            owner_phone=owner_phone
        )
        res = await service.create_vessel(vessel)
        return {"success": True, "data": res.dict()}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def list_all_vessels() -> Dict:
    vessels = await service.list_vessels()
    return {"success": True, "data": [v.dict() for v in vessels]}


# ===================================================
# SPECIES
# ===================================================

async def add_species(
    name: str,
    category: str,
    avg_shelf_life_hours: int,
    ideal_temp_min: float,
    ideal_temp_max: float
) -> Dict:
    try:
        species = Species(
            name=name,
            category=category,
            avg_shelf_life_hours=avg_shelf_life_hours,
            ideal_temp_min=ideal_temp_min,
            ideal_temp_max=ideal_temp_max
        )
        res = await service.create_species(species)
        return {"success": True, "data": res.dict()}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def list_all_species() -> Dict:
    species = await service.list_species()
    return {"success": True, "data": [s.dict() for s in species]}


# ===================================================
# CATCH MANAGEMENT
# ===================================================

async def register_catch_batch(
    vessel_id: int,
    species_id: int,
    catch_weight_kg: float,
    catch_time: str,
    landing_port: str,
    current_status: str,
    ice_applied_time: Optional[str] = None,
    quality_grade: Optional[str] = None
) -> Dict:
    try:
        batch = CatchBatch(
            vessel_id=vessel_id,
            species_id=species_id,
            catch_weight_kg=catch_weight_kg,
            catch_time=normalize_dt(catch_time),
            landing_port=landing_port,
            ice_applied_time=normalize_dt(ice_applied_time) if ice_applied_time else None,
            quality_grade=quality_grade,
            current_status=current_status
        )
        res = await service.create_catch_batch(batch)
        return {"success": True, "data": res.dict()}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def list_catch_batches(status: Optional[str] = None) -> Dict:
    batches = await service.get_catch_batches(status)
    return {"success": True, "data": [b.dict() for b in batches]}


# ===================================================
# AUCTION ANALYTICS
# ===================================================

async def get_total_auctions() -> Dict:
    auctions = await service.list_auctions()
    return {"success": True, "count": len(auctions)}


async def get_total_bids_for_auction(auction_id: int) -> Dict:
    bids = await service.list_bids(auction_id)
    return {"success": True, "count": len(bids)}


# ===================================================
# SPOILAGE MONITORING
# ===================================================

async def get_spoilage_prediction(batch_id: int) -> Dict:
    try:
        prediction = await service.get_spoilage_by_batch(batch_id)
        return {"success": True, "data": prediction.dict()}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def get_high_risk_batches(threshold: float = 0.7) -> Dict:
    batches = await service.get_catch_batches(None)
    high_risk = []
    errors = []

    for b in batches:
        try:
            pred = await service.get_spoilage_by_batch(b.id)
            if pred and pred.predicted_risk >= threshold:
                high_risk.append({
                    "batch_id": b.id,
                    "risk": pred.predicted_risk,
                    "recommended_action": pred.recommended_action
                })
        except Exception as e:
            errors.append({
                "batch_id": b.id,
                "error": str(e)
            })

    return {
        "success": True,
        "data": high_risk,
        "errors": errors if errors else None
    }


async def auto_flag_high_risk_batches(threshold: float = 0.7) -> Dict:
    batches = await service.get_catch_batches(None)
    flagged = []
    errors = []

    for b in batches:
        try:
            pred = await service.get_spoilage_by_batch(b.id)
            if pred and pred.predicted_risk >= threshold:
                await service.update_catch_status(b.id, "high_risk")
                flagged.append(b.id)
        except Exception as e:
            errors.append({
                "batch_id": b.id,
                "error": str(e)
            })

    return {
        "success": True,
        "flagged_batches": flagged,
        "errors": errors if errors else None
    }


# ===================================================
# STORAGE MONITORING
# ===================================================

async def get_temperature_logs(storage_id: int) -> Dict:
    logs = await service.get_temperature_logs(storage_id)
    return {"success": True, "data": [l.dict() for l in logs]}


# ===================================================
# NOTIFICATIONS
# ===================================================

async def list_notifications() -> Dict:
    logs = await service.list_notifications()
    return {"success": True, "data": [l.dict() for l in logs]}


# ===================================================
# ================= INTELLIGENCE LAYER =================
# ===================================================

# 1️⃣ SELF-LEARNING THRESHOLD ADJUSTER

async def learn_optimal_risk_threshold() -> Dict:
    batches = await service.get_catch_batches(None)

    risks = []
    for b in batches:
        try:
            pred = await service.get_spoilage_by_batch(b.id)
            risks.append(pred.predicted_risk)
        except:
            continue

    if not risks:
        return {"success": False, "message": "No spoilage history available"}

    dynamic_threshold = round(mean(risks) + 0.1, 2)

    return {
        "success": True,
        "data": {
            "learned_threshold": dynamic_threshold,
            "historical_average_risk": mean(risks),
            "samples": len(risks)
        }
    }


# 2️⃣ DYNAMIC AUCTION OPTIMIZER

async def dynamic_auction_optimizer(auction_id: int) -> Dict:
    bids = await service.list_bids(auction_id)

    if not bids:
        return {"success": False, "message": "No bids found"}

    weighted_price = (
        sum(b.bid_price_per_kg * b.quantity_kg for b in bids)
        / sum(b.quantity_kg for b in bids)
    )

    optimized_price = round(weighted_price * 1.05, 2)

    return {
        "success": True,
        "data": {
            "auction_id": auction_id,
            "weighted_market_price": weighted_price,
            "recommended_price": optimized_price
        }
    }


# 3️⃣ PREDICTIVE SPOILAGE SIMULATOR

async def simulate_future_spoilage(batch_id: int, hours_ahead: int) -> Dict:
    try:
        pred = await service.get_spoilage_by_batch(batch_id)
        simulated = min(1.0, pred.predicted_risk + (0.01 * hours_ahead))

        return {
            "success": True,
            "data": {
                "batch_id": batch_id,
                "current_risk": pred.predicted_risk,
                "simulated_risk": simulated,
                "hours_ahead": hours_ahead
            }
        }
    except Exception as e:
        return {"success": False, "message": str(e)}


# 4️⃣ VESSEL PERFORMANCE TREND FORECASTER

async def vessel_performance_trend_forecast(vessel_id: int) -> Dict:
    vessels = await service.list_vessels()
    batches = await service.get_catch_batches(None)

    vessel = next((v for v in vessels if v.id == vessel_id), None)

    if not vessel:
        return {"success": False, "message": "Vessel not found"}

    history = [b.catch_weight_kg for b in batches if b.vessel_id == vessel_id]

    if not history:
        return {"success": False, "message": "No historical data"}

    avg_catch = mean(history)
    projected = round(avg_catch * 1.08, 2)

    return {
        "success": True,
        "data": {
            "vessel_id": vessel_id,
            "historical_average_catch": avg_catch,
            "projected_next_trip_catch": projected
        }
    }
async def decision_recommendation_engine(batch_id: int) -> Dict:
    """
    Combines spoilage risk + status to recommend action.
    """

    try:
        batch = next(
            b for b in await service.get_catch_batches(None)
            if b.id == batch_id
        )

        pred = await service.get_spoilage_by_batch(batch_id)

        score = pred.predicted_risk

        if score >= 0.85:
            recommendation = "Immediate auction or discard"
        elif score >= 0.7:
            recommendation = "Fast-track to auction"
        elif score >= 0.5:
            recommendation = "Increase monitoring frequency"
        else:
            recommendation = "Safe for normal storage"

        return {
            "success": True,
            "data": {
                "batch_id": batch_id,
                "risk_score": score,
                "current_status": batch.current_status,
                "recommended_action": recommendation
            }
        }

    except Exception as e:
        return {"success": False, "message": str(e)}
async def auto_auction_pricing_advisor(auction_id: int) -> Dict:
    """
    Recommends price using real bid pressure.
    """

    bids = await service.list_bids(auction_id)

    if not bids:
        return {"success": False, "message": "No bids found"}

    avg_price = sum(b.bid_price_per_kg for b in bids) / len(bids)
    demand_multiplier = 1 + (len(bids) * 0.02)

    suggested_price = round(avg_price * demand_multiplier, 2)

    return {
        "success": True,
        "data": {
            "auction_id": auction_id,
            "average_bid_price": avg_price,
            "bid_count": len(bids),
            "suggested_next_price": suggested_price
        }
    }
async def temperature_anomaly_detector(storage_id: int) -> Dict:
    """
    Detect abnormal temperature spikes.
    """

    logs = await service.get_temperature_logs(storage_id)

    if not logs:
        return {"success": False, "message": "No temperature logs"}

    temps = [l.recorded_temp for l in logs]

    avg_temp = sum(temps) / len(temps)
    anomalies = [t for t in temps if abs(t - avg_temp) > 3]

    return {
        "success": True,
        "data": {
            "storage_id": storage_id,
            "average_temperature": avg_temp,
            "anomaly_count": len(anomalies),
            "anomalies_detected": anomalies
        }
    }
async def vessel_efficiency_ranking() -> Dict:
    """
    Rank vessels by average catch weight.
    """

    vessels = await service.list_vessels()
    batches = await service.get_catch_batches(None)

    ranking = []

    for v in vessels:
        vessel_batches = [
            b.catch_weight_kg for b in batches
            if b.vessel_id == v.id
        ]

        if vessel_batches:
            avg_weight = sum(vessel_batches) / len(vessel_batches)
        else:
            avg_weight = 0

        ranking.append({
            "vessel_id": v.id,
            "registration_number": v.registration_number,
            "average_catch_weight": avg_weight
        })

    ranking.sort(key=lambda x: x["average_catch_weight"], reverse=True)

    return {
        "success": True,
        "data": ranking
    }
