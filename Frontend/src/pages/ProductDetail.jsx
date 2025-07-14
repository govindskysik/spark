import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import productService from "../services/productService";
import cartService from "../services/cartService";
import ImageGallery from "../components/products/ImageGallery";
import ProductInfo from "../components/products/ProductInfo";
import PurchaseBox from "../components/products/PurchaseBox";
import ProductTabs from "../components/products/ProductTabs";
import RelatedProducts from "../components/products/RelatedProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState("description");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);

        if (!response || !response.success) {
          setError("Failed to fetch product details");
          return;
        }

        setProduct(response.product);

        if (response.product?.root_category_name) {
          const relatedProducts = await productService.getProductsByCategory(
            response.product.root_category_name,
            8
          );
          setCategoryProducts(
            relatedProducts.filter((item) => item._id !== id)
          );
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product information");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    const payload = {
      productId: product._id, 
      quantity,
      size: selectedSize,
      color: selectedColor,
    };
    console.log("Adding to cart:", payload);

    try {
      await cartService.addToCart(payload);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  if (loading) {
    return (
      <div className="pt-[85px] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-true-blue"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-[85px] min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600 text-sm">{error || "Product not found"}</p>
        <Link
          to="/"
          className="mt-4 px-4 py-2 bg-true-blue text-white rounded-md hover:bg-blue-700 text-sm"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[85px] min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white py-1.5 px-4 md:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center text-[10px] text-gray-500 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-true-blue">
            Home
          </Link>
          <ChevronRight className="w-2.5 h-2.5 mx-1" />
          {product.root_category_name && (
            <>
              <Link
                to={`/products/category/${product.root_category_name}`}
                className="hover:text-true-blue"
              >
                {product.root_category_name}
              </Link>
              <ChevronRight className="w-2.5 h-2.5 mx-1" />
            </>
          )}
          <span className="text-gray-800 font-medium truncate max-w-[200px]">
            {product.product_name}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-3 md:px-6 md:py-4">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          <div className="md:col-span-3 shadow-sm rounded-md bg-white">
            <ImageGallery
              images={product.image_urls}
              productName={product.product_name}
            />
          </div>

          <div className="md:col-span-2 shadow-sm rounded-md bg-white flex flex-col">
            <ProductInfo
              product={product}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </div>

          <div className="md:col-span-2 shadow-sm rounded-md bg-white flex flex-col">
            <PurchaseBox
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {categoryProducts.length > 0 && (
          <div className="mt-4 shadow-sm rounded-md">
            <RelatedProducts
              categoryName={product.root_category_name}
              products={categoryProducts}
            />
          </div>
        )}

        <div className="mt-4">
          <ProductTabs
            product={product}
            expandedSection={expandedSection}
            toggleSection={toggleSection}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
