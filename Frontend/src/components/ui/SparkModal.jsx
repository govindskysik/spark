import React from "react";
import { motion } from "framer-motion";
import { 
  Mic, 
  AudioWaveform, 
  Sparkles, 
  X, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

const SparkModal = ({
  toggleSpark,
  isListening,
  toggleListening,
  isTyping,
  typingMessage,
  userMessage,
  aiResponse,
  suggestedProducts,
  showMessages,
  setShowMessages,
  chatContainerRef
}) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black z-[999]"
        onClick={toggleSpark}
      />

      {/* Expanding container with modern gradient */}
      <motion.div
        className="fixed inset-0 z-[1000] overflow-hidden flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100"
        initial={{
          clipPath: `circle(0% at ${
            window.innerWidth >= 768
              ? "bottom right 80px"
              : "bottom center"
          })`,
          opacity: 0.9,
        }}
        animate={{
          clipPath: "circle(150% at center)",
          opacity: 1,
        }}
        exit={{
          clipPath: `circle(0% at ${
            window.innerWidth >= 768
              ? "bottom right 80px"
              : "bottom center"
          })`,
          opacity: 0.9,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
        }}
      >
        {/* Main container with responsive layout */}
        <div className="relative flex-1 flex flex-col md:flex-row md:max-w-6xl md:mx-auto md:my-12 md:rounded-2xl md:overflow-hidden md:shadow-2xl">
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={toggleSpark}
            className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-gray-800 transition-all"
          >
            <X size={18} />
          </motion.button>

          {/* Microphone and status area - Takes full height on mobile, left column on desktop */}
          <motion.div
            className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:w-1/2 md:border-r md:border-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Mic button with animations */}
            <motion.button
              onClick={toggleListening}
              className={`relative w-28 h-28 md:w-36 md:h-36 rounded-full shadow-xl flex items-center justify-center mb-6 ${
                isListening
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: isListening
                  ? [
                      "0 10px 25px rgba(59, 130, 246, 0.3)",
                      "0 10px 40px rgba(59, 130, 246, 0.6)",
                      "0 10px 25px rgba(59, 130, 246, 0.3)",
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
                <AudioWaveform className="w-12 h-12 md:w-16 md:h-16" />
              ) : (
                <Mic className="w-12 h-12 md:w-16 md:h-16" />
              )}

              {isListening && (
                <>
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

                  {/* Subtle pulsing effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-400"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [1, 0.8, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ zIndex: -1 }}
                  />
                </>
              )}
            </motion.button>

            {/* Status text */}
            <motion.div
              className="text-center"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {isListening ? "Listening..." : "Tap to speak"}
              </h2>
              <p className="text-gray-500 max-w-xs mx-auto">
                {isListening
                  ? "Tell me what you're shopping for..."
                  : "Ask SPARK to find products for you"}
              </p>
            </motion.div>

            {/* Live transcription */}
            {isListening && isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white/80 backdrop-blur-sm py-3 px-6 rounded-full shadow-md"
              >
                <p className="text-blue-800">
                  {typingMessage}
                  <span className="animate-pulse ml-0.5">|</span>
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Messages and products panel - Bottom area on mobile, right column on desktop */}
          <div className={`
            bg-white 
            rounded-t-3xl 
            shadow-lg 
            overflow-hidden
            md:rounded-none
            md:shadow-none
            md:w-1/2
            md:flex
            md:flex-col
          `}>
            {/* Toggle button - Only on mobile */}
            <button
              onClick={() => setShowMessages((prev) => !prev)}
              className="w-full py-3 flex items-center justify-center border-b border-gray-100 md:hidden"
            >
              {showMessages ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Header for desktop */}
            <div className="hidden md:flex items-center p-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Chat with SPARK</h3>
            </div>

            {/* Messages and products content */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ 
                height: showMessages || window.innerWidth >= 768 ? "auto" : 0 
              }}
              className="overflow-hidden md:flex-1 md:flex md:flex-col"
            >
              {/* Chat messages */}
              <div
                ref={chatContainerRef}
                className={`
                  ${(!userMessage && !aiResponse) ? "flex items-center justify-center" : ""}
                  max-h-60 md:max-h-none md:flex-1
                  overflow-y-auto p-4
                `}
              >
                {(!userMessage && !aiResponse) ? (
                  <p className="text-gray-400 text-center py-8">
                    Your conversation will appear here
                  </p>
                ) : (
                  <>
                    {/* User message */}
                    {userMessage && (
                      <div className="flex justify-end mb-4">
                        <div className="max-w-[80%] bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-tr-none">
                          {userMessage}
                        </div>
                      </div>
                    )}

                    {/* AI response */}
                    {aiResponse && (
                      <div className="flex mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="max-w-[80%] bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm">
                          {aiResponse}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Product suggestions */}
              {suggestedProducts.length > 0 && (
                <div className="px-4 pt-2 pb-6 bg-gray-50 md:mt-auto">
                  <p className="text-sm font-medium text-gray-700 mb-3 ml-2">
                    Products for you:
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2 px-1 md:grid md:grid-cols-2 md:overflow-visible">
                    {suggestedProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden w-40 md:w-full border border-gray-100"
                      >
                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-medium text-gray-800 line-clamp-2 min-h-[2rem]">
                            {product.name}
                          </h4>
                          <p className="text-sm font-bold text-blue-600 mt-1">
                            ${product.price}
                          </p>
                          <button className="w-full mt-2 text-xs bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors">
                            <ShoppingBag className="w-3 h-3" /> Add to
                            Cart
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SparkModal;