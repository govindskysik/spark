import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import categoryService from "../services/categoryService";
import productService from "../services/productService";
import ProductCarousel from "../components/products/ProductCarousel";
import CategoryBanner from "../components/products/CategoryBanner";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 4;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const allCategories = await categoryService.getAllCategories();
        console.log("Fetched categories:", allCategories);
        setCategories(allCategories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProductsForVisibleCategories = async () => {
      setLoading(true);
      
      const startIdx = (currentPage - 1) * categoriesPerPage;
      const endIdx = Math.min(startIdx + categoriesPerPage, categories.length);
      const visibleCategories = categories.slice(startIdx, endIdx);
      
      console.log("Visible categories for page", currentPage, ":", visibleCategories);
      
      try {
        const productsPromises = visibleCategories.map(async (category) => {
          console.log("Fetching products for category:", category);
          const products = await productService.getProductsByCategory(category, 10);
          console.log(`Got ${products?.length || 0} products for ${category}:`, products);
          return { category, products };
        });
        
        const results = await Promise.all(productsPromises);
        
        const newCategoryProducts = {};
        results.forEach(({ category, products }) => {
          newCategoryProducts[category] = products;
        });
        
        console.log("All category products:", newCategoryProducts);
        setCategoryProducts(newCategoryProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (categories.length > 0) {
      fetchProductsForVisibleCategories();
    } else {
      console.log("No categories available yet");
      setLoading(false); 
    }
  }, [categories, currentPage]);


  const totalPages = Math.ceil(categories.length / categoriesPerPage);
  
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getVisibleCategories = () => {
    // Only return actual categories from backend
    if (!categories || categories.length === 0) {
      return [];
    }
    const startIdx = (currentPage - 1) * categoriesPerPage;
    const endIdx = Math.min(startIdx + categoriesPerPage, categories.length);
    return categories.slice(startIdx, endIdx);
  };
  

  const getProductsForCategory = (category) => {

    const products = categoryProducts[category];
    return products || [];
  };


  const handleShopNowClick = () => {
    const visibleCategories = getVisibleCategories();
    if (visibleCategories.length > 0) {
      navigate(`/products/category/${visibleCategories[0]}`);
    } else {
      console.log("No categories available to navigate to");
    }
  };

  return (
    <div className="bg-white pt-[105px]"> 
      <div className="bg-gradient-to-br from-true-blue to-everyday-blue py-16 px-4">
        <div className="w-full p-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sparkathon Summer Sale
          </h1>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Shop our incredible selection with unbeatable prices on all your favorite brands and products!
          </p>
          <button 
            onClick={handleShopNowClick}
            className="bg-spark-yellow text-bentonville-blue px-6 py-3 rounded-full font-bold text-lg hover:bg-opacity-90 transition-colors"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-8 py-8 flex flex-col items-center">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-true-blue"></div>
          </div>
        ) : getVisibleCategories().length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-xl text-gray-500">No categories available from the backend.</p>
            <p className="text-md text-gray-400 mt-2">Please check your backend connection.</p>
          </div>
        ) : (
          <>
            {getVisibleCategories().map((category, index) => (
              <div 
                key={category} 
                className="mb-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {index % 2 === 0 ? (
                    <>
                      <div className="md:col-span-1">
                        <CategoryBanner category={category} isEven={index % 2 === 0} />
                      </div>
                      <div className="md:col-span-2">
                        <ProductCarousel 
                          products={getProductsForCategory(category)} 
                          title={`${category} Products`} 
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-2 order-2 md:order-1">
                        <ProductCarousel 
                          products={getProductsForCategory(category)} 
                          title={`${category} Products`} 
                        />
                      </div>
                      <div className="md:col-span-1 order-1 md:order-2">
                        <CategoryBanner category={category} isEven={index % 2 === 0} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center bg-gradient-to-tr from-everyday-blue to-sky-blue p-2 rounded-full">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      currentPage === 1 
                        ? ' text-neutral-500 cursor-not-allowed' 
                        : 'bg-true-blue text-white'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentPage === i + 1
                            ? 'bg-true-blue text-white font-medium'
                            : 'bg-white text-bentonville-blue hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      currentPage === totalPages 
                        ? 'text-neutral-500 cursor-not-allowed' 
                        : 'bg-true-blue text-white hover:bg-bentonville-blue'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
