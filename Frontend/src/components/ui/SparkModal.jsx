import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AudioWaveform,
  X,
  ChevronUp,
  ChevronDown,
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
      className="w-2 h-2 bg-gray-500 rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
    />
    <motion.span
      className="w-2 h-2 bg-gray-500 rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
    />
    <motion.span
      className="w-2 h-2 bg-gray-500 rounded-full"
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
          const audio = new Audio(audioUrl);
          audio.play();
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

    // Sync local quantities with cart
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
        <span className="text-gray-500 text-sm mx-auto">No products yet.</span>
      );

    return (
      <div className="w-full flex flex-row gap-3 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
        {products.map((product, idx) => (
          <div
            key={product._id || idx}
            className="min-w-[170px] max-w-[170px] bg-white rounded-xl shadow-lg p-2 flex flex-col items-center mx-1"
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
                <div className="flex items-center bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium mr-2">
                  <span>{product.rating}</span>
                  <Sparkles className="w-3 h-3 ml-0.5 fill-current" />
                </div>
              )}
              {product.brand && (
                <span className="text-xs text-gray-500">{product.brand}</span>
              )}
            </div>
            <div className="text-lg font-bold text-bentonville-blue mb-1">
              {product.final_price !== undefined
                ? `$${Number(product.final_price).toFixed(2)}`
                : null}
            </div>
            {/* Add to Cart Button / Quantity Controls */}
            <div className="mt-2 w-full flex justify-center">
              {quantities[product._id] ? (
                <div className="flex items-center gap-2">
                  <button
                    className="bg-blue-100 text-bentonville-blue rounded-full px-2 py-1 font-bold text-lg"
                    onClick={() => handleDecrement(product._id)}
                  >
                    -
                  </button>
                  <span className="font-bold text-bentonville-blue">
                    {quantities[product._id]}
                  </span>
                  <button
                    className="bg-blue-100 text-bentonville-blue rounded-full px-2 py-1 font-bold text-lg"
                    onClick={() => handleIncrement(product._id)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="bg-bentonville-blue text-white rounded-full px-4 py-1 font-semibold text-sm hover:bg-blue-700 transition"
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
        className="fixed w-full h-screen inset-0 z-[1000] overflow-y-auto flex flex-col bg-gradient-to-br from-everyday-blue to-true-blue backdrop-blur-md"
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
        <button
          onClick={toggleSpark}
          className="absolute top-3 right-3 text-bentonville-blue p-2 rounded-full bg-sky-blue hover:bg-true-blue"
        >
          <X />
        </button>

        <div className="h-4/5 relative bg-gradient-to-br from-sky-100 to-indigo-200 rounded-b-4xl overflow-hidden pb-6 pt-14">
          <div className="w-full h-full overflow-hidden px-4 pb-16 flex flex-col items-center justify-start pt-4">
            <div className="w-full rounded-lg max-w-xl overflow-y-auto">
              <div className="space-y-6">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 text-lg ${
                        msg.role === "user"
                          ? "bg-white rounded-b-full rounded-tl-full text-bentonville-blue"
                          : "text-black "
                      } `}
                    >
                      {msg.role === "agent" ? (
                        <div className="prose prose-sm max-w-full text-left">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <span>{msg.text}</span>
                      )}
                    </div>
                  </div>
                ))}

                {typingText !== null && (
                  <div className="flex justify-end">
                    <div className="rounded-lg px-4 py-2 shadow bg-white text-gray-800 animate-pulse text-sm max-w-[80%]">
                      <span>{typingText}</span>
                    </div>
                  </div>
                )}

                {typingText === null &&
                  isListening === false &&
                  products.length === 0 && (
                    <div className="flex justify-start mt-4">
                      <motion.div
                        className="w-12 h-12 rounded-full flex items-center justify-center
                        bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500
                        shadow-xl relative"
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(59,130,246,0.4)",
                            "0 0 0 10px rgba(59,130,246,0)",
                          ],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <AudioWaveform className="text-bentonville-blue animate-pulse" />
                      </motion.div>
                      <span className="ml-3 text-sm text-gray-600 mt-2">
                        Generating response...
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="w-full absolute bottom-5 flex flex-col rounded-b-4xl items-center justify-center px-4">
            <motion.div
              initial={false}
              animate={{
                height: productsExpanded ? "22rem" : "3.5rem", // taller when expanded
                opacity: 1,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              className="w-full max-w-xl mx-auto bg-gradient-to-br from-sky-100 to-indigo-100 backdrop:blur-2xl rounded-4xl shadow-lg p-4 overflow-hidden border border-blue-200"
              style={{ minHeight: "3.5rem" }}
            >
              <div className="flex items-center justify-between mb-2">
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

        <div className="w-full h-1/5 flex flex-col items-center justify-center">
          <motion.button
            onClick={handleMicClick}
            className={`relative w-20 h-20 md:w-36 md:h-36 rounded-full flex items-center justify-center
              bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500
              shadow-xl shadow-yellow-200/40
              [box-shadow:inset_0_2px_8px_#facc15,inset_0_-2px_8px_#fde68a]
              text-bentonville-blue`}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: isListening
                ? [
                    "0 10px 25px rgba(59,130,246,0.3)",
                    "0 10px 40px rgba(59,130,246,0.6)",
                    "0 10px 25px rgba(59,130,246,0.3)",
                  ]
                : "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
            transition={{
              boxShadow: {
                repeat: isListening ? Infinity : 0,
                duration: 2,
              },
            }}
          >
            {isListening ? (
              <>
                <AudioWaveform className="w-12 h-12 md:w-16 md:h-16" />
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-white/60"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{
                      scale: [1, 1.6 + i * 0.2],
                      opacity: [0.6, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            ) : (
              <Sparkles className="w-8 h-8 md:w-16 md:h-16" />
            )}
          </motion.button>
          <p className="text-white mt-6">
            {isListening
              ? "You're live — speak freely"
              : "Click to begin voice session"}
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default SparkModal;
