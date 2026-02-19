from fastapi import APIRouter
from pydantic import BaseModel
from services.tts_service import TTSService

router = APIRouter()
tts_service = TTSService()


class SpeakRequest(BaseModel):
    text: str
    language: str = "en"


@router.post("/speak")
async def speak_text(req: SpeakRequest):
    """
    Convert text to speech and return audio URL.
    
    Supported languages: en (English), hi (Hindi), kn (Kannada)
    """
    result = await tts_service.generate_speech(
        text=req.text,
        language=req.language
    )
    
    return result


@router.get("/languages")
async def get_languages():
    """Get list of supported languages."""
    return {
        "languages": tts_service.get_supported_languages()
    }
