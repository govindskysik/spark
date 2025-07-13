import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ products = [], title }) => {
  const scrollRef = React.useRef(null);
  
  React.useEffect(() => {
    console.log(`ProductCarousel "${title}" received ${products?.length || 0} products:`, products);
  }, [products, title]);
  
  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    
    const scrollAmount = direction === 'left' ? -container.clientWidth / 2 : container.clientWidth / 2;
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold text-bentonville-blue mb-4">{title}</h2>
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative"> 
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-bentonville-blue" />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 px-2 p-2 snap-x scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <div 
              key={product._id || `product-${index}`} 
              className="min-w-[180px] max-w-[180px] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-bentonville-blue" />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
