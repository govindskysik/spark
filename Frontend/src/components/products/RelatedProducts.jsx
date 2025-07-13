import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const RelatedProducts = ({ categoryName, products }) => {
  const scrollRef = useRef(null);

  if (!products || products.length === 0) {
    return null;
  }

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount =
      direction === "left"
        ? -container.clientWidth / 2
        : container.clientWidth / 2;
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          More from {categoryName}
        </h2>
        <Link
          to={`/products/category/${categoryName}`}
          className="text-xs text-true-blue hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-bentonville-blue" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 px-2 py-2 snap-x scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((relatedProduct) => (
            <div
              key={relatedProduct._id}
              className="min-w-[200px] max-w-[200px] snap-start"
            >
              <ProductCard product={relatedProduct} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-bentonville-blue" />
        </button>
      </div>
    </div>
  );
};

export default RelatedProducts;