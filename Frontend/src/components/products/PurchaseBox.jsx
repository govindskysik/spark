import React from "react";
import {
  ShoppingCart,
  Heart,
  Share2,
  TruckIcon,
  Store,
  Info,
  Check,
} from "lucide-react";

const PurchaseBox = ({ product, quantity, setQuantity, handleAddToCart }) => {
  // Display price exactly as it comes from backend with two decimal places
  const displayPrice = (price) => {
    if (price === undefined || price === null) {
      return null;
    }
    return `$${Number(price).toFixed(2)}`;
  };

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Price box - larger price */}
      <div className="bg-gray-50 p-2 border-b flex-shrink-0">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-true-blue">
            {displayPrice(product.final_price)}
          </span>
          {product.initial_price &&
            product.initial_price > product.final_price && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                {displayPrice(product.initial_price)}
              </span>
            )}
        </div>

        {/* Larger savings display with two decimal places */}
        {product.initial_price !== undefined &&
          product.final_price !== undefined &&
          product.initial_price > product.final_price && (
            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded inline-block mt-1 font-medium">
              You save ${Number(product.initial_price - product.final_price).toFixed(
                2
              )} (
              {Math.round(
                ((product.initial_price - product.final_price) /
                  product.initial_price) *
                  100
              )}
              %)
            </div>
          )}
      </div>

      {/* Order section - more compact */}
      <div className="p-2 flex-1 flex flex-col">
        {/* Delivery options - make all cards larger to fill the div */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="border rounded-lg p-4 flex flex-col items-center h-32 justify-center">
            <TruckIcon className="w-5 h-5 text-true-blue mb-2" />
            <div className="text-[12px] font-semibold text-gray-900">
              Shipping
            </div>
            <div className="text-[11px] text-true-blue font-medium">
              {product.shipping_time
                ? `Arrives ${product.shipping_time}`
                : "Arrives soon"}
            </div>
            <div className="text-[10px] text-green-600 mt-1">
              {product.order_deadline}
            </div>
          </div>

          <div className="border rounded-lg p-4 flex flex-col items-center h-32 justify-center">
            <Store className="w-5 h-5 text-gray-400 mb-2" />
            <div className="text-[12px] font-semibold text-gray-900">
              Pickup
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              {product.pickup_available
                ? `Available at ${product.pickup_location}`
                : "Not available"}
            </div>
          </div>

          <div className="border rounded-lg p-4 flex flex-col items-center h-32 justify-center">
            <div className="rounded-md bg-gray-200 p-2 mb-2">
              <ShoppingCart className="w-6 h-6 text-gray-500" />
            </div>
            <div className="text-[12px] font-semibold text-gray-900">
              Delivery
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              {product.home_delivery
                ? `${product.delivery_time}`
                : "Not available"}
            </div>
          </div>
        </div>

        {/* Quantity selector - smaller */}
        <div className="mb-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
            Quantity
          </label>
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <div className="w-8 h-6 flex items-center justify-center border-t border-b border-gray-300 bg-white text-[11px]">
              {quantity}
            </div>
            <button
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Payment options - using backend data if available */}
        {product.payment_options && product.payment_options.length > 0 && (
          <div className="mb-2 bg-gray-50 p-1.5 rounded-md">
            <h4 className="text-[10px] font-medium text-gray-700 mb-1">
              Payment Options
            </h4>
            <div className="grid grid-cols-2 gap-1">
              {product.payment_options.map((option, index) => (
                <div key={index} className="text-[9px] text-gray-600">
                  • {option}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seller info if available */}
        {product.brand && (
          <div className="mb-2">
            <p className="text-[10px] text-gray-700">
              Sold by: <span className="font-medium">{product.brand}</span>
            </p>
          </div>
        )}

        {/* Warranty info - only from backend */}
        {product.warranty && (
          <div className="mb-2 bg-gray-50 p-1.5 rounded-md">
            <div className="flex items-start">
              <div className="p-0.5 bg-gray-200 rounded-full mr-1.5 flex-shrink-0">
                <Info className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-900">
                  Warranty
                </p>
                <p className="text-[9px] text-gray-600">{product.warranty}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add to cart button - MUCH LARGER to fill the div */}
        <div className="flex flex-col justify-end flex-grow">
          <button
            onClick={handleAddToCart}
            disabled={product.in_stock === false}
            className="w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium mb-3 bg-true-blue text-white hover:bg-blue-700 text-md disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-150"
          >
            <ShoppingCart className="w-6 h-6 mr-3" />
            Add to Cart
          </button>

          <div className="flex gap-2">
            <button className="flex-1 bg-white text-gray-800 py-2 px-3 rounded-lg border border-gray-300 flex items-center justify-center text-[12px] font-semibold hover:bg-gray-50">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </button>
            <button className="flex-1 bg-white text-gray-800 py-2 px-3 rounded-lg border border-gray-300 flex items-center justify-center text-[12px] font-semibold hover:bg-gray-50">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBox;
