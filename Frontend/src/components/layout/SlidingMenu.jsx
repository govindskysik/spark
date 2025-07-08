import React, { useEffect, useRef, useState } from "react";
import { ShoppingCart, LogOut, User as UserIcon, Store } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { assets } from "../../assets/assets";
import useAuthStore from "../../store/authStore";
import AuthModal from "../auth/AuthModal";

const SlidingMenu = ({ isMenuOpen, toggleMenu }) => {
  const menuRef = useRef(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Get auth state from store
  const { user, isAuthenticated, logout } = useAuthStore();

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

  const handleAuthClick = () => {
    if (isAuthenticated) {
      console.log("View account details");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    toggleMenu(); // Optional: close menu after logout
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Animation variants
  const menuVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const containerVariants = {
    closed: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const logoVariants = {
    closed: {
      opacity: 0,
      rotate: -30,
      scale: 0.8,
    },
    open: {
      opacity: 1,
      rotate: 0,
      scale: 1,
    },
  };

  const authButtonVariants = {
    closed: {
      opacity: 0,
      scale: 0.8,
      x: -20,
    },
    open: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const dividerVariants = {
    closed: {
      opacity: 0,
      scaleX: 0,
    },
    open: {
      opacity: 1,
      scaleX: 1,
      transition: {
        delay: 0.3,
        duration: 0.4,
      },
    },
  };

  const titleVariants = {
    closed: {
      opacity: 0,
      y: -10,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
      },
    },
  };

  const cartVariants = {
    closed: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.7,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <>
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />

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
                {/* Logo */}
                <motion.div
                  className="flex items-center justify-start gap-4"
                  variants={itemVariants}
                >
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
                  <span className="text-3xl text-bentonville-blue font-medium">Walmart</span>
                </motion.div>

                {/* User Profile Section */}
                <motion.div variants={itemVariants} className="mt-4">
                  {isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {/* User Info */}
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div
                          className="w-14 h-14 bg-true-blue rounded-full flex items-center justify-center shadow-md"
                          whileHover={{ scale: 1.05 }}
                        >
                          <UserIcon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <motion.p
                            className="font-medium text-lg text-gray-800"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            {user?.username ||
                              user?.email?.split("@")[0] ||
                              "User"}
                          </motion.p>
                          <motion.p
                            className="text-sm text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {user?.email}
                          </motion.p>
                        </div>
                      </div>

                      {/* User Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          onClick={handleAuthClick}
                          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          whileHover={{ scale: 1.03, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <UserIcon className="w-4 h-4" />
                          My Account
                        </motion.button>
                        <motion.button
                          onClick={handleLogout}
                          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-red-50 rounded-lg border border-red-100 text-sm font-medium text-red-600 hover:bg-red-100"
                          whileHover={{ scale: 1.03, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={handleAuthClick}
                      variants={authButtonVariants}
                      className="w-full py-3 px-4 bg-true-blue text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700"
                      whileHover={{
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 8px 20px rgba(0, 83, 226, 0.3)",
                      }}
                      whileTap={{
                        scale: 0.98,
                        y: 0,
                      }}
                    >
                      <UserIcon className="w-5 h-5" />
                      Sign In or Create Account
                    </motion.button>
                  )}
                </motion.div>

                <motion.hr
                  className="border-gray-200"
                  variants={dividerVariants}
                />

                {/* Categories */}
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
                          className="w-full text-left py-3 px-3 text-gray-700 rounded-lg font-medium cursor-pointer border border-transparent"
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
    </>
  );
};

export default SlidingMenu;
