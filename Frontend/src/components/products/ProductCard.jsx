import React from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  if (!product) {
    console.error("ProductCard received null or undefined product");
    return null;
  }

  const calculateAverage = () => {
    if (!product.rating_stars) return 0;

    const {
      five_stars = 0,
      four_stars = 0,
      three_stars = 0,
      two_stars = 0,
      one_star = 0,
    } = product.rating_stars;
    const totalRatings =
      five_stars + four_stars + three_stars + two_stars + one_star;
    if (totalRatings === 0) return 0;

    const weightedSum =
      5 * five_stars +
      4 * four_stars +
      3 * three_stars +
      2 * two_stars +
      1 * one_star;
    return (weightedSum / totalRatings).toFixed(1);
  };

  // Display price exactly as it comes from backend
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "N/A";
    }
    return `$${price}`;
  };

  return (
    <Link to={`/product/${product._id}`} className="block h-full">
      <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="h-40 overflow-hidden">
          <img
            src={
              (product.image_urls && product.image_urls[0]) ||
              "https://via.placeholder.com/300x300?text=No+Image"
            }
            alt={product.product_name || "Product"}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.log("Image failed to load, using placeholder");
              e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
            }}
          />
        </div>

        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-sm font-medium text-bentonville-blue line-clamp-2 mb-1">
            {product.product_name || "Unnamed Product"}
          </h3>

          <div className="flex items-center mt-auto mb-1">
            {product.rating && (
              <div className="flex items-center bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium mr-2">
                <span>{product.rating || calculateAverage()}</span>
                <Star className="w-3 h-3 ml-0.5 fill-current" />
              </div>
            )}
            {product.brand && (
              <span className="text-xs text-gray-500">{product.brand}</span>
            )}
          </div>

          <div className="mt-auto">
            <span className="text-lg font-bold text-bentonville-blue">
              {product.final_price !== undefined
                ? `$${Number(product.final_price).toFixed(2)}`
                : null}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
