from fastapi import APIRouter, status
from typing import List

from services.marine_service import MarineService
from repos.marine_repo import MarineRepo
from models.data_models import NotificationLog

router = APIRouter()
repo = MarineRepo()
service = MarineService(repo)


# =====================================================
# 1️⃣ LIST ALL NOTIFICATIONS
# =====================================================

@router.get("/", response_model=List[NotificationLog])
async def list_notifications():
    """
    Retrieve all notification logs.

    Includes:
    - phone_number
    - message_type
    - message_body
    - status
    - created_at
    """
    return await service.list_notifications()


# =====================================================
# 2️⃣ MANUAL LOG NOTIFICATION
# =====================================================

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=NotificationLog,
)
async def create_notification(notification: NotificationLog):
    """
    Log a notification entry in the system.

    Required:
    - phone_number
    - message_type
    - message_body
    - status (sent / failed)
    """
    return await service.log_notification(notification)
