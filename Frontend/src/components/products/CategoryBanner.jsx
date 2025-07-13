import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoryBanner = ({ category, isEven }) => {
  const navigate = useNavigate();
  
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
      className={`${getColorClass()} rounded-lg overflow-hidden p-6 text-white flex flex-col h-full`}
    >
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
    </div>
  );
};

export default CategoryBanner;
