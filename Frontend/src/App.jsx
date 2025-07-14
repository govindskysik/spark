import React, { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import AppRouter from './routes/AppRouter'
import SlidingMenu from './components/layout/SlidingMenu'
import SparkButton from './components/ui/SparkButton'
import useAuthStore from './store/authStore'
import { Toaster } from 'react-hot-toast'
import Footer from './components/layout/Footer'
import AuthModal from './components/auth/AuthModal'

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openAuthModal = () => {
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: { style: { background: '#10B981' }},
          error: { style: { background: '#EF4444' }},
        }}
      />
      
      <SlidingMenu 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
        openAuthModal={openAuthModal}  // 🔥
      />
      
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-out ${isMenuOpen ? 'transform translate-x-80' : 'transform translate-x-0'}`}
      >
        <Navbar 
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          openAuthModal={openAuthModal}  // 🔥
        />
      </div>
      
      <div 
        className={`transition-transform duration-500 ease-out flex-1 ${isMenuOpen ? 'transform translate-x-80' : 'transform translate-x-0'}`}
      >
        <main> 
          <AppRouter />
        </main>
      </div>

      <SparkButton />
      <Footer />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  )
}

export default App
