import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronUp, ChevronDown } from "lucide-react";

const SparkDock = ({ isVisible, toggleVisibility, toggleSpark }) => {
  return (
    <>
      {/* Pull indicator - visible when dock is hidden */}
      {!isVisible && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 z-[998] flex justify-center"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            onClick={toggleVisibility}
            className="bg-white rounded-t-xl shadow-lg px-6 py-1 flex items-center justify-center"
          >
            <ChevronUp className="w-5 h-5 text-gray-500" />
          </button>
        </motion.div>
      )}
    
      {/* Dock */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[999] flex justify-center bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-lg"
        initial={{ y: "100%" }}
        animate={{ y: isVisible ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex items-center justify-between w-full max-w-md px-6 py-3">
          {/* Dock handle for dragging down */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={toggleVisibility}
              className="w-12 h-1 bg-gray-300 rounded-full"
            />
          </div>
          
          {/* Spark Button */}
          <div className="flex-1 flex justify-center mt-3">
            <motion.button 
              onClick={toggleSpark}
              whileTap={{ scale: 0.95 }}
              className="h-14 w-14 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
              aria-label="Spark Voice Assistant"
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SparkDock;