const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const fs = require("fs");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text input" });

  try {
    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "coral", // or shimmer, nova, etc.
      input: text,
      response_format: "mp3",
      instructions: "Speak in a clear, helpful tone.",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.length,
    });
    return res.send(buffer);
  } catch (err) {
    console.error("TTS error:", err);
    return res.status(500).json({ error: "TTS conversion failed" });
  }
});

module.exports = router;
