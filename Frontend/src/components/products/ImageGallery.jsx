import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageGallery = ({ images = [], productName = "Product" }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const handleNextImage = () => {
    if (images && images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    if (images && images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="bg-white h-full w-full flex flex-col justify-center items-center">
        <div className="bg-gray-100 rounded-md flex items-center justify-center h-full w-full">
          <p className="text-gray-400 text-xs">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full h-full flex flex-col">
      {/* Horizontal thumbnail strip on top - larger size */}
      {images.length > 1 && (
        <div className="w-full flex-shrink-0 relative">
          <div className="flex overflow-x-auto gap-1 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? "border-true-blue" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          
          
          {images.length > 5 && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
            </>
          )}
        </div>
      )}
      
      {/* Main image container - fill the entire space */}
      <div className="flex-1 mt-1">
        <div className="relative bg-gray-50 overflow-hidden h-full w-full">
          <img
            src={images[selectedImage]}
            alt={`${productName} - Image ${selectedImage + 1}`}
            className="w-full h-full object-contain"
          />
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </>
          )}
          
          {/* Image counter */}
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full text-[10px]">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;