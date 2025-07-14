import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Truck,
  Gift,
  XCircle,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";

import useCartStore from "../store/useCartStore";
import productService from "../services/productService";
import categoryService from "../services/categoryService";

const placeholderImage = "/src/assets/pictures/placeholder.png";

const CartPage = () => {
  const {
    products = [],
    totalPrice = 0,
    fetchCart,
    removeItem,
    updateItem,
    clearCart,
  } = useCartStore();

  const [productImages, setProductImages] = useState({});
  const [productNames, setProductNames] = useState({});
  const [productPrices, setProductPrices] = useState({});
  const [recommended, setRecommended] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [randomCategories, setRandomCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      const imagesMap = {};
      const namesMap = {};
      const pricesMap = {};
      await Promise.all(
        products
          .map((p) => p.pro ? p.pro : p)
          .filter((info) => info.productId)
          .map(async (info) => {
            try {
              const res = await productService.getProductById(info.productId);
              if (res && res.product) {
                namesMap[info.productId] =
                  res.product.name ||
                  res.product.product_name ||
                  `Product ${info.productId}`;
                imagesMap[info.productId] =
                  res.product.image_urls?.[0] || placeholderImage;
                pricesMap[info.productId] =
                  res.product.final_price !== undefined
                    ? res.product.final_price
                    : res.product.price !== undefined
                    ? res.product.price
                    : null;
              } else {
                namesMap[info.productId] = `Product ${info.productId}`;
                imagesMap[info.productId] = placeholderImage;
                pricesMap[info.productId] = null;
              }
            } catch {
              namesMap[info.productId] = `Product ${info.productId}`;
              imagesMap[info.productId] = placeholderImage;
              pricesMap[info.productId] = null;
            }
          })
      );
      setProductImages(imagesMap);
      setProductNames(namesMap);
      setProductPrices(pricesMap);
    };
    if (products.length > 0) fetchDetails();
  }, [products]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await productService.getProductsByCategory("shoes");
        setRecommended(res.products ? res.products.slice(0, 4) : []);
      } catch {
        setRecommended([]);
      }
    };
    fetchRecommended();
  }, []);

  useEffect(() => {
    // Fetch all categories once
    const fetchCategories = async () => {
      const cats = await categoryService.getAllCategories();
      setAllCategories(cats || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Pick 4 random categories whenever allCategories changes
    if (allCategories.length > 0) {
      const shuffled = [...allCategories].sort(() => 0.5 - Math.random());
      setRandomCategories(shuffled.slice(0, 4));
    }
  }, [allCategories]);

  const estimatedShipping = totalPrice >= 53 ? 0 : 6.99;
  const estimatedTotal = totalPrice + estimatedShipping;
  const savings = 7.01;

  // ❗️Only show empty cart view when cart is empty
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-white">
        <div className="relative mb-6 animate-bounce">
          <ShoppingCart className="w-20 h-20 text-true-blue" />
          <div className="absolute top-0 left-3 w-2 h-2 bg-blue-300 rounded-full animate-ping" />
          <div className="absolute top-1 right-3 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-200" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          Time to start shopping!
        </h2>
        <p className="text-sm text-gray-700 font-medium mt-2 mb-4">
          Your cart is empty
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Fill it up with savings from these popular departments.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {randomCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/products/category/${cat}`)}
              className="px-4 py-1.5 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition"
            >
              {`Shop ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-34 px-4 lg:px-8 bg-white min-h-screen">
      <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <div className="text-sm text-bentonville-blue font-medium">
            <span className="text-lg font-semibold">Cart </span>({products.length}{" "}
            {products.length === 1 ? "item" : "items"})
          </div>
          <div className="bg-true-blue/5 border border-bentonville-blue/20 rounded-lg shadow-xl p-4 mb-2">
            <div className="flex items-center gap-3 mb-2">
              <Truck className="w-6 h-6 bg-sky-blue text-true-blue" />
              <span className="font-semibold text-base text-bentonville-blue">
                Shipping, arrives tomorrow, Jul 14
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Order within <span className="font-bold">6 hr 42 min</span>
            </span>
            <span className="block text-xs text-gray-500 mt-1">
              Free shipping on orders over $35
            </span>

            {/* Cart items list */}
            {products.map((p, i) => {
              const info = p.pro ? p.pro : p;
              return (
                <div
                  key={info.productId ?? i}
                  className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-gray-100 text-sm mt-4"
                >
                  <div className="flex items-center gap-4 w-full">
                    <img
                      src={productImages[info.productId]}
                      alt={productNames[info.productId]}
                      className="w-20 h-20 object-cover rounded border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-bentonville-blue text-base mb-1">
                        {productNames[info.productId]}
                      </h3>
                      <div className="flex gap-4 text-xs text-gray-600 mb-2">
                        <span>
                          Size: <span className="font-bold">{info.size || "-"}</span>
                        </span>
                        <span>
                          Color: <span className="font-bold">{info.color || "-"}</span>
                        </span>
                      </div>
                      <div className="flex gap-2 items-center text-xs mb-2">
                        <Gift className="w-4 h-4 text-yellow-500" />
                        <span>Gift Eligible</span>
                        <span className="ml-2 font-bold text-green-600">
                          Free 90-day returns
                        </span>
                      </div>
                      <div className="flex gap-2 items-center text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                          Deal
                        </span>
                        <span className="text-gray-500">
                          Sold and shipped by{" "}
                          <span className="font-bold text-gray-700">Walmart</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() =>
                          removeItem({
                            productId: info.productId,
                            size: info.size,
                            color: info.color,
                          })
                        }
                        className="px-2 py-1 bg-red-500 text-white rounded text-base font-bold hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="font-semibold text-base">{info.quantity}</span>
                      <button
                        onClick={() =>
                          updateItem({
                            productId: info.productId,
                            size: info.size,
                            color: info.color,
                          })
                        }
                        className="px-2 py-1 bg-true-blue text-white rounded text-base font-bold hover:bg-blue-700 transition"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right mt-2">
                      <span className="text-green-600 font-bold text-base">
                        {productPrices[info.productId] !== undefined && productPrices[info.productId] !== null
                          ? `$${Number(productPrices[info.productId]).toFixed(2)}`
                          : "N/A"}
                      </span>
                      {info.initial_price && info.initial_price > info.final_price && (
                        <>
                          <span className="line-through text-gray-400 ml-2">
                            ${Number(product.initial_price).toFixed(2)}
                          </span>
                          <div className="text-xs text-green-700 mt-1">
                            You save ${Number(info.discount ?? (info.initial_price - info.final_price)).toFixed(2)}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="text-xs text-gray-500 underline hover:text-red-600"
                        onClick={() =>
                          removeItem({
                            productId: info.productId,
                            size: info.size,
                            color: info.color,
                          })
                        }
                      >
                        Remove
                      </button>
                      <button className="text-xs text-gray-500 underline hover:text-true-blue">
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Summary & Recommendations */}
        <div className="flex flex-col gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24 border border-gray-100">
            <button className="bg-true-blue text-white font-bold text-center w-full py-3 rounded-lg hover:bg-blue-700 text-lg mb-4 transition">
              Continue to checkout
            </button>
            <div className="bg-blue-100 text-sm p-3 rounded flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-true-blue" />
              <div>
                <p className="text-blue-800 font-medium">
                  Items in your cart have reduced prices.
                </p>
                <p>Check out now for extra savings!</p>
              </div>
              <button className="ml-auto text-blue-800 hover:text-blue-600">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 border-t pt-4 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>
                  Subtotal ({products.length} item
                  {products.length !== 1 ? "s" : ""})
                </span>
                <span className="line-through text-gray-400">
                  ${Number(totalPrice + savings).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-green-600 font-bold">
                <span>Savings</span>
                <span>-${Number(savings).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-black">
                <span>Price after savings</span>
                <span>${Number(totalPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span>{estimatedShipping > 0 ? `$${estimatedShipping}` : "Free"}</span>
              </div>
              <div className="flex justify-between font-medium text-black">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-bentonville-blue mt-2">
                <span>Estimated total</span>
                <span>${Number(estimatedTotal).toFixed(2)}</span>
              </div>
            </div>

            <button
              className="bg-red-500 text-white px-4 py-2 mt-8 rounded-lg shadow hover:bg-red-600 w-full font-semibold transition"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>

          {/* Recommended products */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h3 className="text-lg font-bold text-bentonville-blue mb-4">
              Recommended for you
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {recommended.map((prod) => (
                <Link
                  key={prod._id}
                  to={`/product/${prod._id}`}
                  className="flex flex-col items-center bg-gray-50 rounded-lg p-3 hover:shadow transition"
                >
                  <img
                    src={
                      prod.image_urls?.[0] ||
                      "/src/assets/pictures/placeholder.png"
                    }
                    alt={prod.name}
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                  <span className="text-xs font-semibold text-gray-700 text-center">
                    {prod.name}
                  </span>
                  <span className="text-xs text-green-600 font-bold mt-1">
                    ${prod.price}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
