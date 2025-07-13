import React from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

const ProductTabs = ({ product, expandedSection, toggleSection }) => {
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

  // Format specifications for display - only actual data
  const formatSpecifications = (specs) => {
    if (!specs || specs.length === 0) return [];
    return specs.filter(spec => spec.name && spec.value);
  };

  // Calculate total number of ratings
  const getTotalRatings = (ratingsObj) => {
    if (!ratingsObj) return 0;
    return Object.values(ratingsObj).reduce((acc, count) => acc + count, 0);
  };
  
  // Don't show tabs if there's no content
  const hasSpecs = product.specifications && product.specifications.length > 0;
  const hasDescription = !!product.description;
  const hasReviews = !!product.rating_stars && getTotalRatings(product.rating_stars) > 0;
  
  if (!hasSpecs && !hasDescription && !hasReviews) {
    return null;
  }

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex">
          {hasDescription && (
            <button
              className={`py-2 px-3 text-xs font-medium border-b-2 ${
                expandedSection === "description"
                  ? "border-true-blue text-true-blue"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => toggleSection("description")}
            >
              Description
            </button>
          )}
          
          {hasSpecs && (
            <button
              className={`py-2 px-3 text-xs font-medium border-b-2 ${
                expandedSection === "specifications"
                  ? "border-true-blue text-true-blue"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => toggleSection("specifications")}
            >
              Specifications
            </button>
          )}
          
          {hasReviews && (
            <button
              className={`py-2 px-3 text-xs font-medium border-b-2 ${
                expandedSection === "reviews"
                  ? "border-true-blue text-true-blue"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => toggleSection("reviews")}
            >
              Reviews ({getTotalRatings(product.rating_stars)})
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {/* Description Content */}
        {expandedSection === "description" && hasDescription && (
          <div className="text-xs text-gray-700 whitespace-pre-line">
            {product.description}
          </div>
        )}
        
        {/* Specifications Content */}
        {expandedSection === "specifications" && hasSpecs && (
          <div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {formatSpecifications(product.specifications).map((spec, index) => (
                <div key={index} className="border-b border-gray-100 pb-1">
                  <dt className="text-[10px] font-medium text-gray-900">{spec.name}</dt>
                  <dd className="text-xs text-gray-700">{spec.value}</dd>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Reviews Content */}
        {expandedSection === "reviews" && hasReviews && (
          <div>
            {/* Review summary */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-gray-900">{product.rating || 0}</div>
                <div className="flex mt-1">{renderStarRating(product.rating || 0)}</div>
                <div className="text-[10px] text-gray-500 mt-1">
                  {getTotalRatings(product.rating_stars)} reviews
                </div>
              </div>
              
              {/* Rating breakdown */}
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = product.rating_stars?.[`${star}_stars`] || product.rating_stars?.[`${star}_star`] || 0;
                  const total = getTotalRatings(product.rating_stars);
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  
                  return (
                    <div key={star} className="flex items-center mb-1">
                      <div className="flex items-center w-8">
                        <span className="text-[10px] text-gray-600">{star}</span>
                        <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400 ml-0.5" />
                      </div>
                      <div className="flex-1 h-1 bg-gray-200 rounded ml-1 mr-2">
                        <div
                          className="h-1 bg-yellow-400 rounded"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-6 text-[10px] text-gray-600">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Review tags */}
            {product.review_tags && product.review_tags.length > 0 && (
              <div className="mb-4">
                <h4 className="text-[10px] font-medium text-gray-900 mb-1">Common mentions</h4>
                <div className="flex flex-wrap gap-1">
                  {product.review_tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-[10px] rounded-full text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Top reviews */}
            <div className="space-y-4">
              {/* Only show if positive review exists */}
              {product.top_reviews && product.top_reviews.positive && product.top_reviews.positive.review && (
                <>
                  <h4 className="text-[10px] font-medium text-gray-900">Top positive review</h4>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="flex">
                      {renderStarRating(5)}
                    </div>
                    <p className="mt-1 text-[10px] text-gray-700">{product.top_reviews.positive.review}</p>
                  </div>
                </>
              )}
              
              {/* Only show if negative review exists */}
              {product.top_reviews && product.top_reviews.negative && product.top_reviews.negative.review && (
                <>
                  <h4 className="text-[10px] font-medium text-gray-900">Top critical review</h4>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="flex">
                      {renderStarRating(2)}
                    </div>
                    <p className="mt-1 text-[10px] text-gray-700">{product.top_reviews.negative.review}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;