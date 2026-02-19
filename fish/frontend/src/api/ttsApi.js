import { BASE_URL } from "./apiClient";

/**
 * Convert text to speech and get audio URL
 * @param {string} text - Text to convert to speech
 * @param {string} language - Language code (en, hi, kn)
 * @returns {Promise<{success: boolean, audio_url?: string, error?: string}>}
 */
export async function speakText(text, language = "en") {
    try {
        const response = await fetch(`${BASE_URL}/tts/speak`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text,
                language,
            }),
        });

        if (!response.ok) {
            throw new Error(`TTS request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("TTS Error:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Get list of supported languages
 * @returns {Promise<{languages: object}>}
 */
export async function getSupportedLanguages() {
    try {
        const response = await fetch(`${BASE_URL}/tts/languages`);

        if (!response.ok) {
            throw new Error(`Failed to fetch languages: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching languages:", error);
        return { languages: {} };
    }
}
