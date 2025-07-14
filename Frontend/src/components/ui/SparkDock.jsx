import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const SparkDock = ({ toggleSpark }) => {
  return (
    <>
      <div
        className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[998] w-[260px] h-[120px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,117,255,0.6), transparent 72%)",
          filter: "blur(24px)",
        }}
      />

      <motion.button
        onClick={toggleSpark}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="fixed bottom-8 left-1/2 z-[999] -translate-x-1/2 flex items-center justify-center px-8 py-4 rounded-full shadow-lg hover:opacity-100 transition-opacity bg-gradient-to-br from-[#6100FF] via-blue-500 to-sky-400"
        style={{
          opacity: 0.95,
          boxShadow:
            "0 0 60px rgba(97, 0, 255, 0.2), 0 8px 40px rgba(0, 117, 255, 0.4)",
          backdropFilter: "blur(10px)",
        }}
        aria-label="Spark Voice Assistant"
      >
        <span className="text-white text-xl font-medium font-walmart">
          Spark
        </span>
        <Sparkles className="w-8 h-8 ml-2 text-spark-yellow drop-shadow" />
      </motion.button>
    </>
  );
};

export default SparkDock;
