import React, { useState } from 'react'
import Navbar from './components/layout/Navbar'
import AppRouter from './routes/AppRouter'
import SlidingMenu from './components/layout/SlidingMenu'

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Sliding Menu */}
      <SlidingMenu 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
      />
      
      {/* Main Content */}
      <div 
        className={`min-h-screen transition-transform duration-500 ease-out ${
          isMenuOpen ? 'transform translate-x-80' : 'transform translate-x-0'
        }`}
      >
        <Navbar 
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu} 
        />
        <main>
          <AppRouter />
        </main>
      </div>
    </div>
  )
}

export default App
