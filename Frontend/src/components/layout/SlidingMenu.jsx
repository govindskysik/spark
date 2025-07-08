import React, { useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { assets } from "../../assets/assets";

const SlidingMenu = ({ isMenuOpen, toggleMenu }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, toggleMenu]);

  const menuVariants = {
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
        when: "afterChildren",
        staggerChildren: 0.08,
        staggerDirection: -1,
      },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 25,
        mass: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const containerVariants = {
    closed: {
      opacity: 0,
      transition: {
        staggerChildren: 0.08,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const logoVariants = {
    closed: {
      scale: 0.7,
      opacity: 0,
      rotate: -80,
      y: -30,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.4,
      },
    },
    open: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.1,
      },
    },
    // Add hover state to variants
    hover: {
      scale: 1.1,
      rotate: 5,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const authButtonVariants = {
    closed: {
      opacity: 0,
      y: 0,
      x: 0,
      scale: 0.8,
      rotate: -8,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.2,
      },
    },
    // Add hover state to variants
    hover: {
      scale: 1.05,
      y: -3,
      boxShadow: "0 6px 25px rgba(0, 83, 226, 0.4)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      y: -30,
      x: -20,
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const dividerVariants = {
    closed: {
      scaleX: 0,
      opacity: 0,
      originX: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      scaleX: 1,
      opacity: 1,
      originX: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.1,
      },
    },
  };

  const cartVariants = {
    closed: {
      opacity: 0,
      y: -40,
      scale: 0.7,
      rotate: -15,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.4,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.1,
      },
    },

    hover: {
      scale: 1.03,
      y: -5,
      boxShadow: "0 10px 30px rgba(255, 194, 32, 0.5)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const titleVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.1,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-opacity-50 z-40"
            onClick={toggleMenu}
          />

          {/* Menu Panel */}
          <motion.div
            ref={menuRef}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 w-80 h-screen bg-white shadow-inner z-50"
            style={{
              boxShadow:
                "inset -10px 0 15px -5px rgba(0,0,0,0.1), 5px 0 15px -5px rgba(0,0,0,0.1)",
            }}
          >
            {/* Menu Content */}
            <motion.div
              className="flex flex-col gap-6 p-6 pt-12 h-full pb-20 overflow-y-auto"
              variants={containerVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Logo & Auth Button */}
              <motion.div
                className="flex items-center justify-start gap-4"
                variants={itemVariants}
              >
                {/* Logo Button */}
                <motion.button
                  onClick={toggleMenu}
                  variants={logoVariants}
                  className="cursor-pointer"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.95,
                    rotate: -10,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  <img
                    className="w-auto h-10"
                    src={assets.walmartLogo}
                    alt="Close Menu"
                  />
                </motion.button>

                {/* Auth Button */}
                <motion.button
                  variants={authButtonVariants}
                  className="px-4 py-2 bg-true-blue text-white text-sm rounded-full font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                    boxShadow: "0 6px 25px rgba(0, 83, 226, 0.4)",
                  }}
                  whileTap={{
                    scale: 0.98,
                    y: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  Sign In or create account
                </motion.button>
              </motion.div>

              <motion.hr
                className="border-gray-200"
                variants={dividerVariants}
              />

              <motion.div className="space-y-4" variants={itemVariants}>
                <motion.h3
                  className="font-walmart font-bold text-gray-800 text-lg"
                  variants={titleVariants}
                >
                  Categories
                </motion.h3>

                <motion.div className="space-y-2">
                  {["Electronics", "Fashion", "Home & Garden", "Grocery"].map(
                    (category, index) => (
                      <motion.button
                        key={category}
                        className="w-full text-left py-3 px-3 text-gray-700 rounded-lg font-medium cursor-pointer border border-transparent" // Added border for better hover effect
                        initial={{ opacity: 0, y: -20, x: -10 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{
                          opacity: 0,
                          y: -15,
                          x: -10,
                          transition: {
                            delay: index * 0.05,
                            duration: 0.2,
                          },
                        }}
                        transition={{
                          delay: 0.4 + index * 0.1,
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        whileHover={{
                          x: 15,
                          scale: 1.08,
                          backgroundColor: "#f1f5f9",
                          color: "#0053e2",
                          borderColor: "#e2e8f0",
                          boxShadow: "0 4px 12px rgba(0, 83, 226, 0.15)",
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                            duration: 0.15,
                          },
                        }}
                        whileTap={{
                          scale: 0.92,
                          x: 8,
                          transition: {
                            type: "spring",
                            stiffness: 600,
                            damping: 20,
                          },
                        }}
                      >
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          whileHover={{
                            fontWeight: 600, 
                          }}
                        >
                          {category}
                        </motion.span>
                      </motion.button>
                    )
                  )}
                </motion.div>
              </motion.div>

              <motion.hr
                className="border-gray-200"
                variants={dividerVariants}
              />

              {/* Cart */}
              <motion.button
                className="w-full flex items-center justify-between py-4 px-4 bg-spark-yellow rounded-xl hover:bg-yellow-400 transition-colors shadow-lg cursor-pointer"
                variants={cartVariants}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 10px 30px rgba(255, 194, 32, 0.5)",
                }}
                whileTap={{
                  scale: 0.97,
                  y: -2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <motion.span
                  className="font-semibold text-gray-800"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.8 }}
                >
                  View Cart
                </motion.span>
                <motion.div
                  initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    rotate: -30,
                    scale: 0.7,
                    transition: { duration: 0.3 },
                  }}
                  transition={{
                    delay: 0.9,
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  whileHover={{
                    rotate: 15,
                    scale: 1.1,
                  }}
                >
                  <ShoppingCart className="w-5 h-5 text-gray-800" />
                </motion.div>
              </motion.button>
              <motion.div className="h-8" variants={itemVariants} />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlidingMenu;
