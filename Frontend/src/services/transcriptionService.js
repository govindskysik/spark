// services/transcriptionService.js

import axios from 'axios';
import API_CONFIG from '../config/api';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 60000,
});

const transcriptionService = {
  sendAudio: async (blob) => {
    const formData = new FormData();
    const file = new File([blob], "audio.webm", { type: "audio/webm" });
    formData.append("audio", file);

    try {
      const response = await apiClient.post('/app/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("Transcribed text:", response.data.text);
      return response.data.text;
    } catch (error) {
      console.error("Failed to send audio to backend:", error);
      return null;
    }
  },

  getSpeechFromText: async (text) => {
    try {
      const response = await apiClient.post("/app/tts", { text }, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "audio/mpeg" });
      return URL.createObjectURL(blob); // usable by <audio src=... />
    } catch (error) {
      console.error("TTS request failed:", error);
      return null;
    }
  }
};

export default transcriptionService;
