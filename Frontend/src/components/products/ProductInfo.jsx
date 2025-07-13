import React from "react";
import { Link } from "react-router-dom";
import { Star, Check } from "lucide-react";

const ProductInfo = ({ 
  product, 
  selectedSize, 
  setSelectedSize,
  selectedColor,
  setSelectedColor
}) => {
  // Calculate star rating display
  const renderStarRating = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          className={`w-3 h-3 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
        />
      );
    }
    return stars;
  };

  // Calculate total number of ratings
  const getTotalRatings = (ratingsObj) => {
    if (!ratingsObj) return 0;
    return Object.values(ratingsObj).reduce((acc, count) => acc + count, 0);
  };

  return (
    <div className="bg-white h-full p-4 flex flex-col">
      {/* Brand and product name */}
      <div className="mb-3">
        {product.brand && (
          <Link 
            to={`/products/category/${product.brand}`}
            className="text-xs text-true-blue font-medium hover:underline"
          >
            {product.brand}
          </Link>
        )}
        <h1 className="text-base font-bold text-gray-900 mt-1">{product.product_name}</h1>
        
        {/* Ratings */}
        {product.rating && (
          <div className="flex items-center mt-1">
            <div className="flex">
              {renderStarRating(product.rating)}
            </div>
            <span className="ml-1 text-xs text-gray-600">
              {product.rating} ({getTotalRatings(product.rating_stars)} reviews)
            </span>
          </div>
        )}
      </div>
      
      {/* Colors - Horizontal scrollable carousel */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-medium text-gray-900 mb-1">Color</h3>
          <div className="flex overflow-x-auto pb-1 scrollbar-hide gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`flex-shrink-0 py-1 px-3 flex items-center justify-center text-[10px] rounded-md border transition-colors whitespace-nowrap
                  ${selectedColor === color
                    ? "border-true-blue bg-blue-50 text-true-blue font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Sizes - Horizontal scrollable carousel */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-medium text-gray-900 mb-1">Size</h3>
          <div className="flex overflow-x-auto pb-1 scrollbar-hide gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-shrink-0 py-1 px-3 flex items-center justify-center text-[10px] rounded-md border transition-colors whitespace-nowrap
                  ${selectedSize === size
                    ? "border-true-blue bg-blue-50 text-true-blue font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-3 mt-auto">
        <h3 className="text-xs font-medium text-gray-900 mb-2">At a Glance</h3>
        <div className="grid grid-cols-2 gap-2">
          {product.specifications && product.specifications.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 p-2 rounded-md">
              <h4 className="text-[10px] font-medium text-gray-800">Specifications</h4>
              <p className="text-[10px] text-gray-600">
                {product.specifications.length} item{product.specifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
          
          {product.root_category_name && (
            <div className="bg-blue-50 border border-blue-100 p-2 rounded-md">
              <h4 className="text-[10px] font-medium text-gray-800">Category</h4>
              <p className="text-[10px] text-gray-600">{product.root_category_name}</p>
            </div>
          )}
          
          {/* Features - Dynamic from specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 p-2 rounded-md col-span-2">
              <h4 className="text-[10px] font-medium text-gray-800">Key Features</h4>
              <ul className="text-[10px] text-gray-600">
                {product.specifications.slice(0, 2).map((spec, index) => (
                  <li key={index} className="flex items-start mt-1">
                    <Check className="w-2.5 h-2.5 text-true-blue mt-0.5 mr-1 flex-shrink-0" />
                    {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;