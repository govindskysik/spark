import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Sparkles,
  AudioWaveform,
  X,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Play,
  Pause,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import useAuthStore from "../../store/authStore";
import transcriptionService from "../../services/transcriptionService";
import agentService from "../../services/agentService";
import productService from "../../services/productService";
import useCartStore from "../../store/useCartStore";

const TypingLoader = () => (
  <div className="flex items-center space-x-1 ml-2">
    <motion.span
      className="w-2 h-2 bg-true-blue rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
    />
    <motion.span
      className="w-2 h-2 bg-true-blue rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
    />
    <motion.span
      className="w-2 h-2 bg-true-blue rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
    />
  </div>
);

const SparkModal = ({ toggleSpark }) => {
  const { user } = useAuthStore();
  const {
    addItem,
    removeItem,
    updateItem,
    products: cartProducts,
  } = useCartStore();

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [ttsAudio, setTtsAudio] = useState(null);
  const [isTTSPAused, setIsTTSPAused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [typingText, setTypingText] = useState(null);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0) setProductsExpanded(true);
  }, [products.length]);

  const extractProductIds = (xmlString) => {
    const regex = /<id>(.*?)<\/id>/g;
    const ids = [];
    let match;
    while ((match = regex.exec(xmlString)) !== null) {
      ids.push(match[1]);
    }
    return ids;
  };

  const formatAgentMessage = (text) => {
    const cleaned = text.replace(/<id>.*?<\/id>/g, "").trim();
    const formatted = cleaned
      .replace(/^(\d+\.)/gm, "\n$1") // list number spacing
      .replace(/\*\*(.*?)\*\*/g, "**$1**") // bold preservation
      .replace(/- /g, "- ") // list item bullet
      .trim();
    return `**Here's what I found:**\n\n${formatted}`;
  };

  const typewriterEffect = (text) => {
    let index = 0;
    setTypingText("");
    const interval = setInterval(() => {
      setTypingText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setTypingText(null);
        setChatHistory((prev) => [...prev, { role: "user", text }]);
      }
    }, 25);
  };

  const playTTS = (audioUrl) => {
    if (ttsAudio) {
      ttsAudio.pause();
      setIsTTSPlaying(false);
      setIsTTSPAused(false);
    }
    const audio = new Audio(audioUrl);
    setTtsAudio(audio);
    setIsTTSPlaying(true);
    setIsTTSPAused(false);
    audio.play();
    audio.onended = () => {
      setIsTTSPlaying(false);
      setIsTTSPAused(false);
      setTtsAudio(null);
    };
  };

  // Pause/Resume TTS
  const handleTTSPauseResume = () => {
    if (ttsAudio) {
      if (isTTSPAused) {
        ttsAudio.play();
        setIsTTSPAused(false);
      } else {
        ttsAudio.pause();
        setIsTTSPAused(true);
      }
    }
  };

  const sendAudioToBackend = async (blob) => {
    try {
      const text = await transcriptionService.sendAudio(blob);
      if (text) {
        typewriterEffect(text);

        const agentReply = await agentService.getAgentResponse({
          user_name: user?.username || "Guest",
          user_age: user?.age || 0,
          user_input: text,
          last_response_id: "",
          use_structuring: false,
        });

        const rawResponse = agentReply.final_output || agentReply.message || "";
        const productIds = extractProductIds(rawResponse);
        const cleanText = formatAgentMessage(rawResponse);

        const audioUrl = await transcriptionService.getSpeechFromText(
          cleanText
        );
        if (audioUrl) {
          playTTS(audioUrl);
        }

        const fetchedProducts = await fetchProductsByIds(productIds);
        setProducts(fetchedProducts);
        setChatHistory((prev) => [...prev, { role: "agent", text: cleanText }]);
      }
    } catch (err) {
      console.error("Transcription/Agent error:", err);
    }
  };

  const fetchProductsByIds = async (ids) => {
    const productPromises = ids.map((id) => productService.getProductById(id));
    const productResults = await Promise.all(productPromises);
    return productResults
      .filter((res) => res && res.success && res.product)
      .map((res) => res.product);
  };

  const resetState = () => {
    mediaRecorderRef.current?.stream
      .getTracks()
      .forEach((track) => track.stop());
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setTimer(0);
    clearInterval(intervalRef.current);
    setIsListening(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        clearInterval(intervalRef.current);
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        sendAudioToBackend(blob);
      };

      mediaRecorderRef.current.start();
      updateTimer();
      setIsListening(true);
    } catch (err) {
      console.error("Microphone access denied or unavailable", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    resetState();
  };

  const handleMicClick = () => {
    if (isTTSPlaying && ttsAudio) {
      ttsAudio.pause();
      ttsAudio.currentTime = 0;
      setIsTTSPlaying(false);
      setIsTTSPAused(false);
      setTtsAudio(null);
    }
    if (isListening) stopRecording();
    else startRecording();
  };

  const updateTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  // ProductCarousel UI for SparkModal
  const SparkProductCarousel = ({ products }) => {
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
      const initial = {};
      products.forEach((p) => {
        const cartItem = cartProducts.find((item) => item.productId === p._id);
        if (cartItem) initial[p._id] = cartItem.quantity;
      });
      setQuantities(initial);
    }, [cartProducts, products]);

    const handleAddToCart = async (id) => {
      setQuantities((prev) => ({ ...prev, [id]: 1 }));
      const product = products.find((p) => p._id === id);
      if (product) {
        await addItem({
          productId: id,
          quantity: 1,
        });
      }
    };

    const handleIncrement = async (id) => {
      const newQty = (quantities[id] || 1) + 1;
      setQuantities((prev) => ({ ...prev, [id]: newQty }));
      await updateItem({
        productId: id,
        quantity: newQty,
      });
    };

    const handleDecrement = async (id) => {
      const newQty = (quantities[id] || 1) - 1;
      if (newQty <= 0) {
        setQuantities((prev) => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
        await removeItem({
          productId: id,
        });
      } else {
        setQuantities((prev) => ({ ...prev, [id]: newQty }));
        await updateItem({
          productId: id,
          quantity: newQty,
        });
      }
    };

    if (!products || products.length === 0)
      return (
        <span className="text-bentonville-blue text-md mx-auto">
          No products yet.
        </span>
      );

    return (
      <div className="w-full flex flex-row gap-3 overflow-x-auto py-4 px-1 scrollbar-hide">
        {products.map((product, idx) => (
          <div
            key={product._id || idx}
            className="min-w-[170px] max-w-[170px] bg-white rounded-xl shadow-md p-2 flex flex-col items-center mx-1"
          >
            <div className="h-24 w-24 flex items-center justify-center overflow-hidden mb-2">
              <img
                src={
                  (product.image_urls && product.image_urls[0]) ||
                  "https://via.placeholder.com/300x300?text=No+Image"
                }
                alt={product.product_name || "Product"}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x300?text=No+Image";
                }}
              />
            </div>
            <h2 className="text-base font-bold text-bentonville-blue mb-1 text-center line-clamp-1 w-full">
              {product.product_name || "Unnamed Product"}
            </h2>
            <div className="flex items-center mb-1">
              {product.rating && (
                <div className="flex items-center text-spark-yellow px-1.5 py-0.5 rounded text-lg font-medium mr-2">
                  <span>{product.rating}</span>
                  <Star className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              )}
              {product.brand && (
                <span className="text-xs text-everyday-blue">
                  {product.brand}
                </span>
              )}
            </div>
            <div className="flex items-end gap-2">
              <div className="text-lg font-bold text-bentonville-blue">
                {product.final_price !== undefined
                  ? `$${Number(product.final_price).toFixed(2)}`
                  : null}
              </div>
              <div className="text-sm font-medium text-bentonville-blue">
                {product.final_price !== undefined
                  ? `$${Number(product.initial_price).toFixed(2)}`
                  : null}
              </div>
            </div>

            {/* Add to Cart Button / Quantity Controls */}
            <div className="mt-2 w-full flex justify-center">
              {quantities[product._id] ? (
                <div className="flex items-center gap-4">
                  <button
                    className="bg-blue-100 text-bentonville-blue rounded-full w-10 h-10 flex items-center justify-center font-bold text-2xl"
                    onClick={() => handleDecrement(product._id)}
                  >
                    -
                  </button>
                  <span className="font-bold text-2xl text-bentonville-blue">
                    {quantities[product._id]}
                  </span>
                  <button
                    className="bg-blue-100 text-bentonville-blue rounded-full w-10 h-10 flex items-center justify-center font-bold text-2xl"
                    onClick={() => handleIncrement(product._id)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="bg-bentonville-blue mb-2 text-white rounded-full px-4 py-1 text-md hover:bg-blue-700 transition"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handlePauseRecording = () => {
    if (
      mediaRecorderRef?.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
    }
  };

  const handleResumeRecording = () => {
    if (
      mediaRecorderRef?.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black z-[999]"
        onClick={toggleSpark}
      />

      <motion.div
        className="fixed w-full h-screen inset-0 z-[1000] overflow-y-auto flex flex-col  bg-gradient-to-br from-sky-100 to-indigo-200 backdrop-blur-md"
        initial={{
          clipPath: `circle(0% at ${
            window.innerWidth >= 768 ? "bottom right 80px" : "bottom center"
          })`,
          opacity: 0.9,
        }}
        animate={{ clipPath: "circle(150% at center)", opacity: 1 }}
        exit={{
          clipPath: `circle(0% at ${
            window.innerWidth >= 768 ? "bottom right 80px" : "bottom center"
          })`,
          opacity: 0.9,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      >
        <div className="w-auto flex items-center justify-between px-2 py-2 bg-white mx-20 mt-2 rounded-full shadow-lg relative">
          <div className="w-3/4 text-center text-bentonville-blue">
            <h2 className="text-sm text-nowrap font-medium">
              Spark Voice Assistant
            </h2>
          </div>
          <button
            onClick={toggleSpark}
            className="text-white p-1 rounded-full bg-gradient-to-br from-everyday-blue/80 to-indigo-400/80 backdrop-blur-sm hover:bg-true-blue"
          >
            <X />
          </button>
        </div>

        <div className="h-4/5 relative flex items-center  mx-4  rounded-4xl overflow-hidden mt-4 pt-4 pb-24">
          <div className="w-full h-full scrollbar-hide rounded-lg max-w-xl  overflow-y-auto">
            <div className="space-y-6">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div className="flex items-end gap-2">
                      <div className="flex flex-col items-end">
                        <div className="px-4 py-3 text-lg bg-white rounded-b-full rounded-tl-full text-bentonville-blue">
                          <span>{msg.text}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center ml-3 gap-2 mb-1">
                          <Sparkles className="w-7 h-7 text-true-blue" />
                        </div>
                        <div className="px-4 py-3 text-lg text-black">
                          <div className="prose prose-sm max-w-full text-left">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {typingText !== null && (
                <div className="flex justify-end items-center gap-2">
                  <div className="flex flex-col items-end">
                    <div className="rounded-lg px-4 py-2 shadow bg-white text-gray-800 animate-pulse text-sm max-w-[80%] flex items-center">
                      <span>{typingText}</span>
                      <TypingLoader />
                    </div>
                  </div>
                </div>
              )}

              {typingText === null &&
                isListening === false &&
                products.length === 0 &&
                chatHistory.length > 0 &&
                chatHistory[chatHistory.length - 1]?.role === "user" && (
                  <div className="flex justify-start mt-4 items-center gap-2">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center ml-3 gap-2 mb-1">
                        <Sparkles className="w-7 h-7 text-true-blue" />
                        <TypingLoader />
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
          <div className="w-full absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col rounded-b-4xl items-center justify-center px-4">
            <motion.div
              initial={false}
              animate={{
                height: productsExpanded ? "22rem" : "3.5rem",
                opacity: 1,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              className="w-full max-w-xl mx-auto bg-gradient-to-br from-sky-100/80 to-indigo-100/80 backdrop-blur-sm rounded-4xl shadow-lg p-4 overflow-hidden border border-blue-200"
              style={{ minHeight: "3.5rem" }}
            >
              <div className="flex items-center justify-between">
                <h1 className="text-bentonville-blue text-center text-lg font-bold">
                  Products
                </h1>
                <button
                  onClick={() => setProductsExpanded((prev) => !prev)}
                  className="ml-2 p-1 rounded-full bg-white shadow hover:bg-blue-100 transition"
                  aria-label={productsExpanded ? "Shrink" : "Expand"}
                >
                  {productsExpanded ? (
                    <ChevronDown className="w-5 h-5 text-bentonville-blue" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-bentonville-blue" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {productsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full flex items-center justify-center"
                  >
                    <SparkProductCarousel products={products} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Voice/Chat Controls at Bottom */}
        <div className="w-auto h-1/7 mx-4 mb-8 flex flex-row bg-gradient-to-br from-sky-400/20 to-indigo-400/20 backdrop-blur-xl shadow-xl rounded-4xl items-center justify-center gap-12">
          <button
            className="flex items-center justify-center w-14 h-14 rounded-full bg-everyday-blue shadow-xl hover:bg-blue-200 transition "
            aria-label="Switch to Chat"
            onClick={() => {}}
          >
            <span className="font-bold text-bentonville-blue text-lg">
              <MessageCircle className="w-6 h-6" />
            </span>
          </button>

          <motion.button
            onClick={handleMicClick}
            className="w-20 h-20 flex items-center justify-center rounded-full shadow-lg transition-opacity bg-gradient-to-br text-spark-yellow from-[#6100FF] via-blue-500 to-sky-400 relative"
            style={{
              opacity: 0.95,
              boxShadow:
                "0 0 60px rgba(97, 0, 255, 0.2), 0 8px 40px rgba(0, 117, 255, 0.4)",
            }}
            transition={{
              boxShadow: {
                repeat: isListening ? Infinity : 0,
                duration: 2,
              },
            }}
            aria-label="Voice Assistant"
          >
            {isListening ? (
              <>
                <AudioWaveform className="w-12 h-12 md:w-16 md:h-16 animate-pulse" />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-blue-400 pointer-events-none"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-300 pointer-events-none"
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </>
            ) : (
              <Sparkles className="w-9 h-9 md:w-16 md:h-16" />
            )}
          </motion.button>

          <button
            className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-400/90 to-red-500/70 transition shadow-xl`}
            aria-label={
              isTTSPlaying
                ? isTTSPAused
                  ? "Resume Voice"
                  : "Pause Voice"
                : isListening
                ? "Pause Listening"
                : "Resume Listening"
            }
            onClick={() => {
              if (isTTSPlaying) {
                handleTTSPauseResume();
              } else if (isListening) {
                if (mediaRecorderRef.current?.state === "recording") {
                  handlePauseRecording();
                } else if (mediaRecorderRef.current?.state === "paused") {
                  handleResumeRecording();
                }
              }
            }}
          >
            {isTTSPlaying ? (
              isTTSPAused ? (
                <Play className="w-7 h-7 text-white" />
              ) : (
                <Pause className="w-7 h-7 text-white" />
              )
            ) : isListening ? (
              mediaRecorderRef.current?.state === "paused" ? (
                <Play className="w-7 h-7 text-white" />
              ) : (
                <Pause className="w-7 h-7 text-white" />
              )
            ) : (
              <Pause className="w-7 h-7 text-white" />
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default SparkModal;
