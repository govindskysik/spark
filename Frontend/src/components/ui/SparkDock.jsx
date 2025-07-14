import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronUp, ChevronDown } from "lucide-react";

const SparkDock = ({ isVisible, toggleVisibility, toggleSpark }) => {
  return (
    <>
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
            className="w-full bg-true-blue/80 backdrop-blur-lg border-t border-gray-200 rounded-t-xl shadow-2xl px-6 py-1 flex items-center justify-center"
          >
            <ChevronUp className="w-7 h-7 text-white" />
          </button>
        </motion.div>
      )}
    
      {/* Dock */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[999] flex justify-center bg-true-blue/80 backdrop-blur-lg border-t border-gray-200 shadow-lg"
        initial={{ y: "100%" }}
        animate={{ y: isVisible ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex items-center justify-between w-full max-w-md px-6 py-6">
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 ">
            <button 
              onClick={toggleVisibility}
              className="w-12 h-1 bg-white rounded-full"
            />
          </div>
          
          {/* Spark Button */}
          <div className="flex-1 flex justify-center mt-3">
            <motion.button 
              onClick={toggleSpark}
              whileTap={{ scale: 0.95 }}
              className="h-14 w-40 rounded-full bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-200/40
                [box-shadow:inset_0_2px_8px_#facc15,inset_0_-2px_8px_#fde68a] relative"
              aria-label="Spark Voice Assistant"
              style={{
                boxShadow: "0 4px 24px 0 rgba(250, 202, 21, 0.25), inset 0 2px 8px #facc15, inset 0 -2px 8px #fde68a"
              }}
            >
              <span className="font-bold text-bentonville-blue mr-2">Spark</span>
              <Sparkles className="w-7 h-7 text-bentonville-blue drop-shadow" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SparkDock;