import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../services/productService";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; 

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log(`Fetching products for category: ${categoryName}`);
        const fetchedProducts = await productService.getProductsByCategory(categoryName);
        console.log(`Fetched ${fetchedProducts?.length || 0} products`);
        setProducts(fetchedProducts || []);
      } catch (error) {
        console.error(`Error fetching products for category ${categoryName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchProducts();
    }
  }, [categoryName]);

  // Pagination controls
  const totalPages = Math.ceil(products.length / productsPerPage);
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };


  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const isFeaturedProduct = (index) => {
    const rowNumber = Math.floor(index / 3);
    const columnInRow = index % 3;
    
    if (rowNumber % 2 === 0) {
      return columnInRow === 0;
    }
    else {
      return columnInRow === 2;
    }
  };

  return (
    <div className="min-h-screen pt-[100px] bg-white">
      <div className="w-full px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-bentonville-blue">
            {categoryName}
          </h1>
          <p className="text-gray-600 mt-2">
            Browse our selection of {categoryName.toLowerCase()} products
          </p>
        </div>

        <div className="bg-gradient-to-br from-sky-blue/20 to-sky-blue/40 p-6 rounded-lg flex flex-col items-center">
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-true-blue"></div>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-xl text-gray-700">No products available for this category.</p>
              <p className="text-md text-gray-600 mt-2">Please check your backend connection or try another category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
                {currentProducts.map((product, index) => (
                  <div 
                    key={product._id} 
                    className={`bg-white rounded-lg overflow-hidden transition-all
                      ${isFeaturedProduct(index) ? 'row-span-2 md:row-span-2' : ''}`}
                  >
                    {isFeaturedProduct(index) ? (
                      // Large featured product layout (stacked)
                      <>
                        <div className="h-60 overflow-hidden">
                          <img
                            src={(product.image_urls && product.image_urls[0]) || 'https://via.placeholder.com/300x300?text=No+Image'}
                            alt={product.title || product.product_title || product.name || 'Product'}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-medium text-bentonville-blue mb-2">
                            {product.title || product.product_title || product.name || 'Unnamed Product'}
                          </h3>
                          {product.brand && (
                            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                          )}
                          <p className="text-lg font-bold text-bentonville-blue">
                            ${product.final_price || 'N/A'}
                          </p>
                          <button className="mt-3 bg-true-blue text-white px-4 py-2 rounded-full text-sm hover:bg-bentonville-blue transition-colors">
                            Add to Cart
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full">
                        <div className="w-1/3 h-full overflow-hidden">
                          <img
                            src={(product.image_urls && product.image_urls[0]) || 'https://via.placeholder.com/300x300?text=No+Image'}
                            alt={product.title || product.product_title || product.name || 'Product'}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="w-2/3 p-3 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-medium text-bentonville-blue line-clamp-2 mb-1">
                              {product.title || product.product_title || product.name || 'Unnamed Product'}
                            </h3>
                            {product.brand && (
                              <p className="text-xs text-gray-500">{product.brand}</p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm font-bold text-bentonville-blue">
                              ${product.final_price || 'N/A'}
                            </p>
                            <button className="bg-true-blue text-white px-2 py-1 rounded-full text-xs hover:bg-bentonville-blue transition-colors">
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center bg-gradient-to-tr from-everyday-blue/90 to-sky-blue mt-8  p-2 rounded-full">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        currentPage === 1 
                          ? 'text-neutral-500 cursor-not-allowed' 
                          : 'bg-true-blue text-white hover:bg-bentonville-blue'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
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
    </div>
  );
};

export default CategoryPage;
