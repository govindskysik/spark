import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const SparkCard = ({ toggleSpark }) => {
  return (
    <motion.button 
      onClick={toggleSpark}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden flex items-center p-4 gap-4 border border-blue-400/60"
    >
      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
        <Sparkles className="w-6 h-6 text-blue-600" />
      </div>
      <div className="text-left">
        <h3 className="font-bold text-white text-lg">SPARK</h3>
        <p className="text-xs text-blue-100">Voice Shopping Assistant</p>
      </div>
    </motion.button>
  );
};

export default SparkCard;