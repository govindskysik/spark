import React, { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  LogOut,
  User as UserIcon,
  Store,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { assets } from "../../assets/assets";
import useAuthStore from "../../store/authStore";
import categoryService from "../../services/categoryService";
import { Link, useNavigate } from "react-router-dom";

const SlidingMenu = ({ isMenuOpen, toggleMenu, openAuthModal }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const fetchCategories = async () => {
      if (isMenuOpen) {
        setLoadingCategories(true);
        try {
          const fetchedCategories = await categoryService.getAllCategories();
          setCategories(fetchedCategories);
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        } finally {
          setLoadingCategories(false);
        }
      }
    };

    fetchCategories();
  }, [isMenuOpen]);

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
    } else {
      toggleMenu();
      openAuthModal();
    }
  };

  const handleLogout = () => {
    logout();
    toggleMenu(); // Close menu after logout
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
              {/* Menu Content - Updated to use flex for full height layout */}
              <motion.div
                className="flex flex-col h-full"
                variants={containerVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {/* Scrollable content area */}
                <div className="flex-1 overflow-hidden flex flex-col p-6 pt-12">
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
                    <span className="text-3xl text-bentonville-blue font-medium">
                      Walmart
                    </span>
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
                    className="border-gray-200 my-4"
                    variants={dividerVariants}
                  />

                  {/* Categories - Updated for full height */}
                  <motion.div
                    className="flex flex-col flex-1 min-h-0"
                    variants={itemVariants}
                  >
                    <motion.h3
                      className="font-walmart font-bold text-gray-800 text-lg mb-4"
                      variants={titleVariants}
                    >
                      Categories
                    </motion.h3>

                    {/* Scrollable Categories List - Hidden scrollbar */}
                    <motion.div
                      className="flex-1 overflow-y-auto pr-4 -mr-2"
                      style={{
                        msOverflowStyle: "none" /* IE and Edge */,
                        scrollbarWidth: "none" /* Firefox */,
                      }}
                    >
                      <style>{`
                        .hide-scrollbar::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>

                      {loadingCategories ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="w-6 h-6 text-true-blue animate-spin" />
                        </div>
                      ) : categories.length > 0 ? (
                        <div className="space-y-2 hide-scrollbar">
                          {categories.map((category, index) => (
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
                                  delay: index * 0.03,
                                  duration: 0.2,
                                },
                              }}
                              transition={{
                                delay: 0.2 + Math.min(index * 0.05, 0.5),
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                              whileHover={{
                                x: 15,
                                scale: 1.05,
                                backgroundColor: "#f1f5f9",
                                color: "#0053e2",
                                borderColor: "#e2e8f0",
                                boxShadow: "0 4px 12px rgba(0, 83, 226, 0.15)",
                              }}
                              onClick={() => {
                                toggleMenu();
                              }}
                            >
                              <Link
                                to={`/products/category/${category}`}
                                className="block w-full h-full"
                              >
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ delay: 0.1 }}
                                  whileHover={{ fontWeight: 600 }}
                                >
                                  {category}
                                </motion.span>
                              </Link>
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No categories found
                        </div>
                      )}
                    </motion.div>
                  </motion.div>

                  <motion.hr
                    className="border-gray-200 my-4"
                    variants={dividerVariants}
                  />
                </div>

                {/* Cart button - Fixed at bottom */}
                <div className="p-6 pt-0">
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
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SlidingMenu;
