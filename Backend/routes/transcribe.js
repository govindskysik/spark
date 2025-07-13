const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const formidable = require('formidable');
const fs = require('fs');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const form = formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.audio) {
      console.error("Form parse error or missing audio:", err);
      return res.status(400).json({ error: 'Audio file missing or malformed' });
    }

    try {
      const audioFile = files.audio;
      const filePath = audioFile.filepath;

      console.log("Received audio file:", {
        audioFile
      });

      const transcription = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: fs.createReadStream(filePath),
        filename: audioFile.originalFilename || "audio.webm", 
        response_format: "text"
      });

      console.log("Transcription result:", transcription);

      return res.json({ text: transcription });
    } catch (error) {
      console.error("Whisper API error:", error);
      return res.status(500).json({ error: 'Transcription failed' });
    }
  });
});

module.exports = router;
