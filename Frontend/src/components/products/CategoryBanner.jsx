import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoryBanner = ({ category, isEven }) => {
  const navigate = useNavigate();
  const bannerRef = useRef();
  const [visible, setVisible] = useState(false);

  // Lazy load the banner when it enters the viewport
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    if (bannerRef.current) observer.observe(bannerRef.current);
    return () => {
      if (bannerRef.current) observer.unobserve(bannerRef.current);
    };
  }, []);

  const getColorClass = () => {
    const colors = [
      'bg-true-blue', 
      'bg-spark-yellow',
      'bg-everyday-blue', 
      'bg-bentonville-blue',
    ];
    const hash = category.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + acc;
    }, 0);
    return colors[hash % colors.length];
  };
  
  const handleClick = () => {
    navigate(`/products/category/${category}`);
  };

  return (
    <div
      ref={bannerRef}
      className={`${getColorClass()} rounded-lg overflow-hidden p-6 text-white flex flex-col h-full`}
      style={{ minHeight: "180px", opacity: visible ? 1 : 0.2, transition: "opacity 0.5s" }}
    >
      {visible ? (
        <>
          <h2 className="text-xl md:text-2xl font-bold mb-2">{category}</h2>
          <p className="text-white/80 mb-6 flex-grow">
            Discover amazing deals on our {category.toLowerCase()} collection
          </p>
          <button 
            onClick={handleClick}
            className="flex items-center gap-2 bg-white text-bentonville-blue px-4 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all self-start mt-auto"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse w-2/3 h-8 bg-white/30 rounded mb-2" />
        </div>
      )}
    </div>
  );
};

export default CategoryBanner;
