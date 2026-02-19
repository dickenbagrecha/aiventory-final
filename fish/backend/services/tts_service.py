import os
import time
from pathlib import Path
from typing import Optional
from gtts import gTTS


class TTSService:
    """
    Text-to-Speech service supporting multiple languages.
    Generates audio files and returns URLs for playback.
    """

    SUPPORTED_LANGUAGES = {
        "en": "English",
        "hi": "Hindi",
        "kn": "Kannada"
    }

    def __init__(self):
        # Ensure audio directory exists
        self.audio_dir = Path(__file__).parent.parent / "static" / "audio"
        self.audio_dir.mkdir(parents=True, exist_ok=True)

    async def generate_speech(
        self,
        text: str,
        language: str = "en"
    ) -> dict:
        """
        Generate speech audio from text.

        Args:
            text: Text to convert to speech
            language: Language code (en, hi, kn)

        Returns:
            dict with success status and audio_url
        """
        try:
            # Validate language
            if language not in self.SUPPORTED_LANGUAGES:
                language = "en"  # Default to English

            # Clean text
            clean_text = text.strip()
            if not clean_text:
                return {
                    "success": False,
                    "error": "Empty text provided"
                }

            # Generate unique filename
            timestamp = int(time.time() * 1000)
            filename = f"speech_{language}_{timestamp}.mp3"
            filepath = self.audio_dir / filename

            # Configure accent/region
            # Use 'co.in' for Indian accent in English, and generally for Indian languages if supported
            tld = "co.in" 

            # Generate speech using gTTS
            tts = gTTS(text=clean_text, lang=language, tld=tld, slow=False)
            tts.save(str(filepath))

            # Return URL path (relative to static mount)
            audio_url = f"/static/audio/{filename}"

            return {
                "success": True,
                "audio_url": audio_url,
                "language": language,
                "filename": filename
            }

        except Exception as e:
            print(f"[TTS] Error generating speech: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def get_supported_languages(self) -> dict:
        """Return list of supported languages."""
        return self.SUPPORTED_LANGUAGES
