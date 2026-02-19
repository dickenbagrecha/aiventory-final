from typing import List, Optional

from services.marine_service import MarineService
from repos.marine_repo import MarineRepo
from models.data_models import (
    CatchBatch,
    SpoilagePrediction,
    NotificationLog,
)


class BaseDomainAgent:
    """
    Base wrapper to ensure single service wiring.
    """

    def __init__(self):
        repo = MarineRepo()
        self.service = MarineService(repo)


class RiskDomainAgent(BaseDomainAgent):
    """
    Handles spoilage-related operations.
    """

    async def get_spoilage(self, batch_id: int) -> SpoilagePrediction:
        return await self.service.get_spoilage_by_batch(batch_id)

    async def update_status(self, batch_id: int, status: str):
        return await self.service.update_catch_status(batch_id, status)

    async def list_batches(
        self, status_filter: Optional[str] = None
    ) -> List[CatchBatch]:
        return await self.service.get_catch_batches(status_filter=status_filter)


class NotificationDomainAgent(BaseDomainAgent):
    """
    Handles notification logging.
    """

    async def log_notification(self, notification: NotificationLog):
        return await self.service.log_notification(notification)


class StorageDomainAgent(BaseDomainAgent):
    """
    Reserved for temperature/storage logic.
    """

    async def list_storage_units(self):
        return await self.service.list_storage_units()

    async def get_temperature_logs(self, storage_id: int):
        return await self.service.get_temperature_logs(storage_id)


class AuctionDomainAgent(BaseDomainAgent):
    """
    Reserved for auction-related logic.
    """

    async def list_auctions(self):
        return await self.service.list_auctions()

    async def list_bids(self, auction_id: int):
        return await self.service.list_bids(auction_id)
