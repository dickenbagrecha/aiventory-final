from fastapi import APIRouter, status
from typing import List

from services.marine_service import MarineService
from repos.marine_repo import MarineRepo
from models.data_models import Auction, Bid

router = APIRouter()
repo = MarineRepo()
service = MarineService(repo)


# =====================================================
# 1️⃣ CREATE AUCTION
# =====================================================

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=Auction,
)
async def create_auction(auction: Auction):
    """
    Create a new auction session.

    Required:
    - port
    - auction_date
    - base_price_per_kg

    Optional:
    - recommended_price_per_kg
    """
    return await service.create_auction(auction)


# =====================================================
# 2️⃣ LIST ALL AUCTIONS
# =====================================================

@router.get("/", response_model=List[Auction])
async def list_auctions():
    """
    Retrieve all auction sessions.
    """
    return await service.list_auctions()


# =====================================================
# 3️⃣ CREATE BID
# =====================================================

@router.post(
    "/bid",
    status_code=status.HTTP_201_CREATED,
    response_model=Bid,
)
async def create_bid(bid: Bid):
    """
    Create a new bid for an auction.

    Required:
    - auction_id
    - buyer_name
    - bid_price_per_kg
    - quantity_kg
    - timestamp
    """
    return await service.create_bid(bid)


# =====================================================
# 4️⃣ LIST BIDS BY AUCTION
# =====================================================

@router.get("/{auction_id}/bids", response_model=List[Bid])
async def list_bids(auction_id: int):
    """
    Retrieve all bids for a specific auction.
    """
    return await service.list_bids(auction_id)
