import React, { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import AppRouter from './routes/AppRouter'
import SlidingMenu from './components/layout/SlidingMenu'
import useAuthStore from './store/authStore'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      
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
