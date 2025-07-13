import React, { useState, useEffect } from "react";
import {
  Menu,
  LayoutGrid,
  X,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Search,
  User,
  LogOut,
} from "lucide-react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import AuthModal from "../auth/AuthModal";
import categoryService from "../../services/categoryService";
import useCartStore from "../../store/useCartStore";

const Navbar = ({ isMenuOpen, toggleMenu }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { products, fetchCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart(); // fetch only if logged in
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await categoryService.getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setIsAuthModalOpen(false);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-md w-full bg-white">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Main Header */}
      <header className="bg-true-blue w-full px-4 md:px-8 h-16 flex items-center justify-center">
        <div className="flex items-center h-14 justify-between w-full max-w-7xl mx-auto">
          <button
            onClick={toggleMenu}
            className="md:hidden rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="text-white w-7 h-7" />
            ) : (
              <Menu className="text-white w-7 h-7" />
            )}
          </button>

          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src={assets.walmartLogo}
              alt="Walmart"
              className="h-8 w-auto object-contain"
            />
          </button>

          <div className="hidden md:flex items-center w-60 gap-2 px-2 py-1 rounded-full bg-bentonville-blue/70 text-white">
            <div className="bg-everyday-blue h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold whitespace-nowrap">
                  Pickup or Delivery?
                </span>
                <button className="text-[10px] flex items-center gap-1">
                  <span className="whitespace-nowrap">Rewari, 123302</span>
                </button>
              </div>
              <ChevronDown className="w-5 h-5 flex-shrink-0" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="min-w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full h-10 bg-white text-xs placeholder:text-xs placeholder:text-true-blue text-bentonville-blue rounded-full p-4 pr-14 border-0 focus:outline-none focus:ring-2 focus:ring-spark-yellow"
              />
              <Search className="absolute right-2 bg-bentonville-blue rounded-full p-1 top-1/2 transform -translate-y-1/2 w-7 h-7 text-white" />
            </div>
          </div>
          <div className="hidden md:flex bg-bentonville-blue/70 px-3 py-2 rounded-full items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <button className="text-white transition-colors flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-regular">
                      {user?.username ||
                        user?.email?.split("@")[0] ||
                        "Account"}
                    </span>
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white p-1 rounded-full hover:cursor-pointer bg-everyday-blue transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleAuthClick}
                className="text-white hover:text-spark-yellow transition-colors flex items-center gap-1"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Sign in</span>
              </button>
            )}
          </div>
          <div className="relative">
            <button
              className="flex items-center"
              onClick={() => navigate("/cart")}
              aria-label="View Cart"
            >
              <ShoppingCart className="text-white w-6 h-6" />
              {products.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-spark-yellow text-bentonville-blue text-[10px] flex items-center justify-center w-4 h-4 font-bold  rounded-full">
                  {products.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="bg-true-blue w-full md:hidden">
        <div className="flex items-center h-12 px-2 md:px-8 max-w-7xl mx-auto">
          <div className="flex md:hidden items-center gap-2 text-white">
            <div className="bg-everyday-blue h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <button className="text-xs flex items-center gap-1">
              <span className="whitespace-nowrap">Rewari, 123302</span>
              <ChevronDown className="w-3 h-3 flex-shrink-0" />
            </button>
          </div>

          {/* Spacer for mobile */}
          <div className="flex-1 md:hidden"></div>
        </div>
      </div>
      <div className="hidden md:block bg-sky-blue md:py-2 md:px-8 text-bentonville-blue">
        <div className="hidden md:flex items-center ">
          <div className="flex items-center">
            <LayoutGrid className=" w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Categories</span>
            <span className="ml-4 mr-6">|</span>
          </div>
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
            {isLoading ? (
              <div className="text-xs">Loading categories...</div>
            ) : (
              categories.map((category) => (
                <button
                  key={category}
                  onClick={() => navigate(`/products/category/${category}`)}
                  className="text-bentonville-blue text-[10px] whitespace-nowrap hover:cursor-pointer hover:underline transition-all duration-200"
                >
                  {category}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
