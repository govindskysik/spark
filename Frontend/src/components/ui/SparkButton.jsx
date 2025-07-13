import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Mic,
  ShoppingBag,
  AudioWaveform,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import SparkModal from "./SparkModal";
import SparkDock from "./SparkDock";
import SparkCard from "./SparkCard";

const SparkButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningDuration, setListeningDuration] = useState(0);
  const [userMessage, setUserMessage] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [showMessages, setShowMessages] = useState(true);
  const [isDockVisible, setIsDockVisible] = useState(true);
  const chatContainerRef = useRef(null);

  // Sample product data
  const productExamples = [
    {
      id: 1,
      name: "Sony WH-1000XM4 Headphones",
      price: 349.99,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Apple iPad Air 10.9-inch",
      price: 599.99,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Samsung 55-inch QLED 4K TV",
      price: 799.99,
      image: "https://via.placeholder.com/100",
    },
  ];

  const toggleSpark = () => {
    setIsOpen(!isOpen);
    if (isListening) setIsListening(false);
    // Clear messages when closing
    if (isOpen) {
      setUserMessage("");
      setAiResponse("");
      setTypingMessage("");
      setSuggestedProducts([]);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    setListeningDuration(0);
    if (!isListening) {
      // Clear previous messages when starting new listening session
      setUserMessage("");
      setTypingMessage("");
      setIsTyping(false);
    }
  };

  const simulateProductSearch = (query) => {
    // Simulate product suggestions based on query
    setTimeout(() => {
      if (
        query.toLowerCase().includes("headphone") ||
        query.toLowerCase().includes("audio")
      ) {
        setSuggestedProducts([productExamples[0]]);
      } else if (
        query.toLowerCase().includes("ipad") ||
        query.toLowerCase().includes("tablet")
      ) {
        setSuggestedProducts([productExamples[1]]);
      } else if (
        query.toLowerCase().includes("tv") ||
        query.toLowerCase().includes("television")
      ) {
        setSuggestedProducts([productExamples[2]]);
      } else if (query.toLowerCase().includes("electronics")) {
        setSuggestedProducts(productExamples);
      } else {
        setSuggestedProducts([]);
      }
    }, 1500);
  };

  // Simulate listening and transcription
  useEffect(() => {
    let timer;
    let typeTimer;

    if (isListening) {
      // Simulate voice recognition with predefined phrases
      const phrases = [
        "Show me some headphones",
        "I need a new iPad",
        "Looking for electronics deals",
        "Do you have TVs on sale?",
      ];

      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      let currentText = "";

      // Stop listening after 3 seconds
      timer = setTimeout(() => {
        setIsListening(false);
        setUserMessage(randomPhrase);
        setTypingMessage("");
        setIsTyping(false);

        // Generate AI response after user message
        setTimeout(() => {
          const responses = [
            `I found some great options for ${
              randomPhrase.toLowerCase().includes("headphone")
                ? "headphones"
                : randomPhrase.toLowerCase().includes("ipad")
                ? "tablets"
                : randomPhrase.toLowerCase().includes("tv")
                ? "televisions"
                : "electronics"
            } for you!`,
            `Here are some ${
              randomPhrase.toLowerCase().includes("headphone")
                ? "headphones"
                : randomPhrase.toLowerCase().includes("ipad")
                ? "iPads"
                : randomPhrase.toLowerCase().includes("tv")
                ? "TVs"
                : "electronics"
            } I think you'll like.`,
            `Check out these popular ${
              randomPhrase.toLowerCase().includes("headphone")
                ? "headphones"
                : randomPhrase.toLowerCase().includes("ipad")
                ? "iPads"
                : randomPhrase.toLowerCase().includes("tv")
                ? "TVs"
                : "electronics"
            } based on your request.`,
          ];
          setAiResponse(
            responses[Math.floor(Math.random() * responses.length)]
          );
          simulateProductSearch(randomPhrase);
        }, 1000);
      }, 3000);

      // Simulate real-time typing during listening
      typeTimer = setInterval(() => {
        if (currentText.length < randomPhrase.length) {
          currentText = randomPhrase.substring(0, currentText.length + 1);
          setTypingMessage(currentText);
          setIsTyping(true);
        } else {
          clearInterval(typeTimer);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(typeTimer);
      };
    }
  }, [isListening]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [userMessage, aiResponse, isTyping, typingMessage]);
  
  // Detect scroll to show/hide the dock
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) { // Only for mobile
        const scrollY = window.scrollY;
        const scrollThreshold = 50;
        
        if (scrollY > scrollThreshold && isDockVisible) {
          setIsDockVisible(false);
        } else if (scrollY <= scrollThreshold && !isDockVisible) {
          setIsDockVisible(true);
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDockVisible]);

  const handleDockToggle = () => {
    setIsDockVisible(!isDockVisible);
  };

  return (
    <>
      {/* Mobile dock */}
      <div className="md:hidden">
        <SparkDock 
          isVisible={isDockVisible}
          toggleVisibility={handleDockToggle}
          toggleSpark={toggleSpark}
        />
      </div>

      {/* Desktop card */}
      <div className="hidden md:block fixed bottom-6 right-6 z-[999]">
        <SparkCard toggleSpark={toggleSpark} />
      </div>

      {/* Modal - shown when the button is clicked */}
      <AnimatePresence>
        {isOpen && (
          <SparkModal
            isOpen={isOpen}
            toggleSpark={toggleSpark}
            isListening={isListening}
            toggleListening={toggleListening}
            isTyping={isTyping}
            typingMessage={typingMessage}
            userMessage={userMessage}
            aiResponse={aiResponse}
            suggestedProducts={suggestedProducts}
            showMessages={showMessages}
            setShowMessages={setShowMessages}
            chatContainerRef={chatContainerRef}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SparkButton;
