from typing import List, Optional
from fastapi import HTTPException

from models.data_models import (
    Vessel,
    Species,
    CatchBatch,
    ColdStorageUnit,
    TemperatureLog,
    Auction,
    Bid,
    SpoilagePrediction,
    NotificationLog,
)

from repos.marine_repo import MarineRepo


class MarineService:
    def __init__(self, repo: MarineRepo):
        self.repo = repo

    # =====================================================
    # VESSELS
    # =====================================================

    async def create_vessel(self, vessel: Vessel) -> Vessel:
        if isinstance(vessel, dict):
            vessel = Vessel(**vessel)
        return await self.repo.create_vessel(vessel)

    async def list_vessels(self) -> List[Vessel]:
        return await self.repo.list_vessels()

    async def delete_vessel(self, vessel_id: int) -> dict:
        deleted = await self.repo.delete_vessel(vessel_id)
        if deleted == 0:
            raise HTTPException(status_code=404, detail="Vessel not found")
        return {"message": f"Vessel {vessel_id} deleted successfully"}


    # =====================================================
    # SPECIES
    # =====================================================

    async def create_species(self, species: Species) -> Species:
        if isinstance(species, dict):
            species = Species(**species)
        return await self.repo.create_species(species)

    async def list_species(self) -> List[Species]:
        return await self.repo.list_species()


    # =====================================================
    # CATCH BATCHES
    # =====================================================

    async def create_catch_batch(self, batch: CatchBatch) -> CatchBatch:
        if isinstance(batch, dict):
            batch = CatchBatch(**batch)
        return await self.repo.create_catch_batch(batch)

    async def get_catch_batches(
        self, status_filter: Optional[str] = None
    ) -> List[CatchBatch]:
        batches = await self.repo.list_catch_batches()

        if status_filter:
            batches = [b for b in batches if b.current_status == status_filter]

        return batches

    async def update_catch_status(self, batch_id: int, status: str) -> dict:
        success = await self.repo.update_catch_status(batch_id, status)

        if not success:
            raise HTTPException(status_code=404, detail="Catch batch not found")

        return {"message": "Catch batch status updated successfully"}


    # =====================================================
    # COLD STORAGE
    # =====================================================

    async def create_storage_unit(self, storage: ColdStorageUnit) -> ColdStorageUnit:
        if isinstance(storage, dict):
            storage = ColdStorageUnit(**storage)
        return await self.repo.create_storage_unit(storage)

    async def list_storage_units(self) -> List[ColdStorageUnit]:
        return await self.repo.list_storage_units()

    async def log_temperature(self, temp: TemperatureLog) -> TemperatureLog:
        if isinstance(temp, dict):
            temp = TemperatureLog(**temp)
        return await self.repo.log_temperature(temp)

    async def get_temperature_logs(self, storage_id: int) -> List[TemperatureLog]:
        return await self.repo.get_temperature_logs(storage_id)


    # =====================================================
    # AUCTIONS
    # =====================================================

    async def create_auction(self, auction: Auction) -> Auction:
        if isinstance(auction, dict):
            auction = Auction(**auction)
        return await self.repo.create_auction(auction)

    async def list_auctions(self) -> List[Auction]:
        return await self.repo.list_auctions()

    async def create_bid(self, bid: Bid) -> Bid:
        if isinstance(bid, dict):
            bid = Bid(**bid)
        return await self.repo.create_bid(bid)

    async def list_bids(self, auction_id: int) -> List[Bid]:
        return await self.repo.list_bids_by_auction(auction_id)


    # =====================================================
    # SPOILAGE PREDICTIONS
    # =====================================================

    async def create_spoilage_prediction(
        self, prediction: SpoilagePrediction
    ) -> SpoilagePrediction:
        if isinstance(prediction, dict):
            prediction = SpoilagePrediction(**prediction)
        return await self.repo.create_spoilage_prediction(prediction)

    async def get_spoilage_by_batch(self, batch_id: int) -> Optional[SpoilagePrediction]:
        result = await self.repo.get_spoilage_by_batch(batch_id)

        if not result:
            raise HTTPException(
                status_code=404, detail="Spoilage prediction not found"
            )

        return result


    # =====================================================
    # NOTIFICATIONS
    # =====================================================

    async def log_notification(self, notification: NotificationLog) -> NotificationLog:
        if isinstance(notification, dict):
            notification = NotificationLog(**notification)
        return await self.repo.log_notification(notification)

    async def list_notifications(self) -> List[NotificationLog]:
        return await self.repo.list_notifications()
