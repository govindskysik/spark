import React from "react";
import { ShoppingCart, LayoutGrid } from "lucide-react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const navigate = useNavigate();

  const categories = ["Electronics", "Clothing", "Home"];

  return (
    <footer className="bg-true-blue py-10 px-4 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Logo and Brand */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <span className="text-5xl md:text-5xl font-medium text-white font-walmart tracking-wide">
            Walmart
          </span>
          <img
            src={assets.walmartLogo}
            alt="Walmart"
            className="h-16 w-auto object-contain"
          />
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.4 }}
          className="flex flex-col md:flex-row gap-8 items-center"
        >
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center font-semibold gap-2 text-bentonville-blue bg-gradient-to-br px-6 py-3 rounded-full from-yellow-400 via-yellow-300 to-yellow-500 justify-center shadow-2xl shadow-yellow-200/40
                [box-shadow:inset_0_2px_8px_#facc15,inset_0_-2px_8px_#fde68a] transition-all text-lg"
          >
            <ShoppingCart className="w-6 h-6" />
            Cart
          </button>
          <div className="flex flex-wrap gap-4 items-center">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.1, color: "#FFC220" }}
                onClick={() => navigate(`/products/category/${cat}`)}
                className="text-white text-lg font-medium hover:text-spark-yellow transition-all"
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1 }}
        className="text-center text-sky-blue mt-8 text-sm"
      >
        &copy; {new Date().getFullYear()} Walmart. All rights reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
