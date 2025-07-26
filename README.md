# 🔊 Spark – Voice-Based Shopping Assistant

A conversational shopping assistant that allows users to search and add products to their cart using voice commands. Powered by OpenAI's Whisper and ChatGPT, Spark provides a natural, voice-first shopping experience.

🌐 **Live Demo**: [spark-seven-chi.vercel.app](https://spark-seven-chi.vercel.app/)

---

## 🚀 Features

- 🎙️ **Voice Commands** – Talk to Spark to search products or add items to your cart.
- 🧠 **Conversational AI** – ChatGPT understands natural queries and gives contextual replies.
- 🛒 **Dynamic Cart System** – Products are added/removed from cart in real-time.
- 🔊 **Text-to-Speech** – Spark replies using AI-generated speech.
- 📦 **Smart Recommendations** – Product suggestions from Amazon/Walmart using AI queries.

---

## 🛠️ Tech Stack

| Frontend        | Backend       | AI & NLP                                | Database |
|-----------------|---------------|------------------------------------------|----------|
| React, TailwindCSS | Node.js (Serverless) | OpenAI Whisper (STT), ChatGPT, TTS API | MongoDB  |

- **Whisper** – Converts speech to text
- **ChatGPT API** – Understands user intent and generates response
- **TTS API** – Converts replies into spoken voice
- **MongoDB** – Stores cart items and session data

---

## 🎮 How It Works

1. Click the 🎤 microphone button to start speaking.
2. **Whisper** transcribes your voice to text.
3. **ChatGPT** interprets what you want (search, add to cart, etc.).
4. Spark responds using **Text-to-Speech**.
5. Products are displayed and updated live on screen.

---

## 📸 Screenshots

![Voice Command Example](https://github.com/govindskysik/spark/blob/main/Frontend/src/assets/SS.jpg)
