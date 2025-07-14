import React, { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import categoryService from "../services/categoryService";
import productService from "../services/productService";
const ProductCarousel = lazy(() => import("../components/products/ProductCarousel"));
const CategoryBanner = lazy(() => import("../components/products/CategoryBanner"));
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
    if (categories.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const startIdx = (currentPage - 1) * categoriesPerPage;
    const endIdx = Math.min(startIdx + categoriesPerPage, categories.length);
    const visibleCategories = categories.slice(startIdx, endIdx);

    // Reset products for new page
    setCategoryProducts({});

    let loadedCount = 0;
    visibleCategories.forEach(async (category) => {
      try {
        const products = await productService.getProductsByCategory(category, 10);
        setCategoryProducts(prev => ({
          ...prev,
          [category]: products || []
        }));
      } catch (error) {
        setCategoryProducts(prev => ({
          ...prev,
          [category]: []
        }));
      } finally {
        loadedCount++;
        if (loadedCount === visibleCategories.length) {
          setLoading(false);
        }
      }
    });
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
      <div className="bg-gradient-to-br from-true-blue to-everyday-blue p-8 md:py-16 px-4">
        <div className="w-full p-2  md:p-10 text-center">
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
              <div key={category} className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {index % 2 === 0 ? (
                    <>
                      <div className="md:col-span-1">
                        <Suspense fallback={<div className="h-40 w-full bg-blue-100 animate-pulse rounded-lg" />}>
                          <CategoryBanner category={category} isEven={index % 2 === 0} />
                        </Suspense>
                      </div>
                      <div className="md:col-span-2">
                        <Suspense fallback={<div className="h-40 w-full bg-gray-100 animate-pulse rounded-lg" />}>
                          <ProductCarousel
                            products={getProductsForCategory(category)}
                            title={`${category} Products`}
                          />
                        </Suspense>
                        {/* Show a loader if products for this category are not loaded yet */}
                        {categoryProducts[category] === undefined && (
                          <div className="h-40 w-full bg-gray-100 animate-pulse rounded-lg" />
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-2 order-2 md:order-1">
                        <Suspense fallback={<div className="h-40 w-full bg-gray-100 animate-pulse rounded-lg" />}>
                          <ProductCarousel
                            products={getProductsForCategory(category)}
                            title={`${category} Products`}
                          />
                        </Suspense>
                        {categoryProducts[category] === undefined && (
                          <div className="h-40 w-full bg-gray-100 animate-pulse rounded-lg" />
                        )}
                      </div>
                      <div className="md:col-span-1 order-1 md:order-2">
                        <Suspense fallback={<div className="h-40 w-full bg-blue-100 animate-pulse rounded-lg" />}>
                          <CategoryBanner category={category} isEven={index % 2 === 0} />
                        </Suspense>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8">
                <div className="flex items-center gap-2 bg-white border border-blue-200 p-3 rounded-xl shadow-lg">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 border-2 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 border-blue-200'
                    }`}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {(() => {
                      let start = Math.max(1, currentPage - 1);
                      let end = Math.min(totalPages, start + 2);
                      if (end - start < 2) start = Math.max(1, end - 2);

                      return Array.from({ length: end - start + 1 }, (_, idx) => {
                        const pageNum = start + idx;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 border-2 ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white border-blue-600 shadow'
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 border-blue-200'
                            }`}
                            aria-label={`Go to page ${pageNum}`}
                          >
                            {pageNum}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 border-2 ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 border-blue-200'
                    }`}
                    aria-label="Next Page"
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
