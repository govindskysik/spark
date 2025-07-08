import React from "react";
import { Menu, X } from "lucide-react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, MapPin, ChevronDown } from "lucide-react";
import { Search } from "lucide-react";

const Navbar = ({ isMenuOpen, toggleMenu }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav>
      {/* Main Header */}
      <header className="bg-true-blue w-full px-4 h-20 flex items-center justify-center">
        <div className="flex items-center h-14 justify-between w-full">
          {/* Menu Button */}
          <div className="flex items-center">
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
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
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
          </div>

          {/* Search Bar */}
          <div className="h-full flex">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full h-full bg-white placeholder:text-bentonville-blue text-bentonville-blue rounded-full pl-12 pr-4 border-0 focus:outline-none focus:ring-2 focus:ring-spark-yellow shadow-sm "
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-bentonville-blue" />
            </div>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center">
            <button>
              <ShoppingCart className="text-white w-7 h-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Secondary Bar */}
      <div className="bg-true-blue">
        <div className="flex items-center justify-between h-12 px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-everyday-blue h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium whitespace-nowrap">
              Pickup or Delivery ? 
            </span>
          </div>

          <button className="text-white text-sm flex items-center gap-1 hover:bg-white/10 px-3 py-1.5 rounded transition-colors ml-4">
            <span className="whitespace-nowrap">Rewari, 123302</span>
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
