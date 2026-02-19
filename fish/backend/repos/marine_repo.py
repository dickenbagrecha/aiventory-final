from typing import Optional, List
from datetime import datetime, timezone

from models.data_models import (
    Vessel, Species, CatchBatch,
    ColdStorageUnit, TemperatureLog,
    Auction, Bid, SpoilagePrediction,
    NotificationLog
)
from db import PostgresDB


# -----------------------------
# Utilities
# -----------------------------

def normalize_dt(dt):
    if dt is None:
        return None
    if isinstance(dt, str):
        dt = datetime.fromisoformat(dt)
    if dt.tzinfo is not None:
        return dt.astimezone(timezone.utc).replace(tzinfo=None)
    return dt


# =====================================================
# MARINE FISHERY REPO
# =====================================================

class MarineRepo:

    # =====================================================
    # VESSELS
    # =====================================================

    async def create_vessel(self, v: Vessel):
        async with PostgresDB.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO vessels
                (registration_number, owner_name, owner_phone,
                 vessel_type, capacity_kg, home_port)
                VALUES ($1,$2,$3,$4,$5,$6)
                RETURNING *""",
                v.registration_number,
                v.owner_name,
                v.owner_phone,
                v.vessel_type,
                v.capacity_kg,
                v.home_port,
            )
        return Vessel(**dict(row))

    async def list_vessels(self):
        async with PostgresDB.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM vessels")
        return [Vessel(**dict(r)) for r in rows]

    async def delete_vessel(self, vessel_id: int):
        async with PostgresDB.pool.acquire() as conn:
            r = await conn.execute(
                "DELETE FROM vessels WHERE id=$1",
                vessel_id,
            )
        return int(r.split()[-1])


    # =====================================================
    # SPECIES
    # =====================================================

    async def create_species(self, s: Species):
        async with PostgresDB.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO species
                (name, category, avg_shelf_life_hours,
                 ideal_temp_min, ideal_temp_max)
                VALUES ($1,$2,$3,$4,$5)
                RETURNING *""",
                s.name,
                s.category,
                s.avg_shelf_life_hours,
                s.ideal_temp_min,
                s.ideal_temp_max,
            )
        return Species(**dict(row))

    async def list_species(self):
        async with PostgresDB.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM species")
        return [Species(**dict(r)) for r in rows]


    # =====================================================
    # CATCH BATCHES
    # =====================================================

    async def create_catch_batch(self, c: CatchBatch):
        c.catch_time = normalize_dt(c.catch_time)
        c.ice_applied_time = normalize_dt(c.ice_applied_time)

        async with PostgresDB.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO catch_batches
                (vessel_id, species_id, catch_weight_kg,
                 catch_time, landing_port, ice_applied_time,
                 quality_grade, current_status)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING *""",
                c.vessel_id,
                c.species_id,
                c.catch_weight_kg,
                c.catch_time,
                c.landing_port,
                c.ice_applied_time,
                c.quality_grade,
                c.current_status,
            )
        return CatchBatch(**dict(row))

    async def list_catch_batches(self):
        async with PostgresDB.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM catch_batches")
        return [CatchBatch(**dict(r)) for r in rows]

    async def update_catch_status(self, batch_id: int, status: str):
        async with PostgresDB.pool.acquire() as conn:
            r = await conn.execute(
                "UPDATE catch_batches SET current_status=$1 WHERE id=$2",
                status,
                batch_id,
            )
        return r.endswith("1")


    # =====================================================
    # COLD STORAGE
    # =====================================================

    async def create_storage_unit(self, s: ColdStorageUnit):
        async with PostgresDB.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO cold_storage_units
                (location, max_capacity_kg,
                 current_load_kg, current_temp)
                VALUES ($1,$2,$3,$4)
                RETURNING *""",
                s.location,
                s.max_capacity_kg,
                s.current_load_kg,
                s.current_temp,
            )
        return ColdStorageUnit(**dict(row))

    async def list_storage_units(self):
        async with PostgresDB.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM cold_storage_units")
        return [ColdStorageUnit(**dict(r)) for r in rows]

    async def log_temperature(self, t: TemperatureLog):
        t.timestamp = normalize_dt(t.timestamp)

        async with PostgresDB.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO temperature_logs
                (storage_unit_id, recorded_temp, timestamp)
                VALUES ($1,$2,$3)
                RETURNING *""",
                t.storage_unit_id,
                t.recorded_temp,
                t.timestamp,
            )
        return TemperatureLog(**dict(row))

    async def get_temperature_logs(self, storage_id: int):
        async with PostgresDB.pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT * FROM temperature_logs WHERE storage_unit_id=$1",
                storage_id,
            )
        return [TemperatureLog(**dict(r)) for r in rows]


    # =====================================================
    # AUCTIONS
    # =====================================================

    async def create_auction(self, a: Auction):
        async with PostgresDB.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO auctions
                (port, auction_date,
                 base_price_per_kg, recommended_price_per_kg)
                VALUES ($1,$2,$3,$4)
                RETURNING *""",
                a.port,
                a.auction_date,
                a.base_price_per_kg,
                a.recommended_price_per_kg,
            )
        return Auction(**dict(row))

    async def list_auctions(self):
        async with PostgresDB.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM auctions")
        return [Auction(**dict(r)) for r in rows]

    async def create_bid(self, b: Bid):
        b.timestamp = normalize_dt(b.timestamp)

        async with PostgresDB.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO bids
                (auction_id, buyer_name,
                 bid_price_per_kg, quantity_kg, timestamp)
                VALUES ($1,$2,$3,$4,$5)
                RETURNING *""",
                b.auction_id,
                b.buyer_name,
                b.bid_price_per_kg,
                b.quantity_kg,
                b.timestamp,
            )
        return Bid(**dict(row))

    async def list_bids_by_auction(self, auction_id: int):
        async with PostgresDB.pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT * FROM bids WHERE auction_id=$1",
                auction_id,
            )
        return [Bid(**dict(r)) for r in rows]


    # =====================================================
    # SPOILAGE PREDICTIONS
    # =====================================================

    async def create_spoilage_prediction(self, s: SpoilagePrediction):
        async with PostgresDB.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO spoilage_predictions
                (catch_batch_id, predicted_risk,
                 confidence_score, recommended_action)
                VALUES ($1,$2,$3,$4)
                RETURNING *""",
                s.catch_batch_id,
                s.predicted_risk,
                s.confidence_score,
                s.recommended_action,
            )
        return SpoilagePrediction(**dict(row))

    async def get_spoilage_by_batch(self, batch_id: int):
        async with PostgresDB.pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT * FROM spoilage_predictions WHERE catch_batch_id=$1",
                batch_id,
            )
        return SpoilagePrediction(**dict(row)) if row else None


    # =====================================================
    # NOTIFICATIONS
    # =====================================================

    async def log_notification(self, n: NotificationLog):
        async with PostgresDB.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO notifications_log
                (phone_number, message_type,
                 message_body, status)
                VALUES ($1,$2,$3,$4)
                RETURNING *""",
                n.phone_number,
                n.message_type,
                n.message_body,
                n.status,
            )
        return NotificationLog(**dict(row))

    async def list_notifications(self):
        async with PostgresDB.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM notifications_log")
        return [NotificationLog(**dict(r)) for r in rows]
