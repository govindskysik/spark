import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import { ChevronRight, Filter, ShoppingBag } from 'lucide-react';

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('recommended');
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProductsByCategory(category, itemsPerPage, currentPage);
        
        if (response && Array.isArray(response)) {
          setProducts(response);
          // If your API provides total pages info, you can set it here
          // setTotalPages(response.totalPages || 1);
        } else {
          setProducts([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Reset scroll position when category or page changes
    window.scrollTo(0, 0);
  }, [category, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    // You would typically re-fetch or sort the products here
  };

  // Display products based on sort option (client-side sorting for demonstration)
  const displayProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.final_price - b.final_price;
      case 'price-high':
        return b.final_price - a.final_price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0; // Keep original order for 'recommended'
    }
  });

  return (
    <div className="pt-[105px] min-h-screen bg-gray-50">
      {/* Breadcrumb navigation */}
      <div className="bg-white py-2 px-4 md:px-8 shadow-sm">
        <div className="flex items-center text-xs text-gray-500">
          <Link to="/" className="hover:text-true-blue">Home</Link>
          <ChevronRight className="w-3 h-3 mx-1" />
          <span className="text-gray-800 font-medium">{category}</span>
        </div>
      </div>
      
      {/* Category header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">{category}</h1>
          <p className="mt-2 text-blue-100">
            Browse our selection of {category.toLowerCase()} products
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8">
        {/* Filters and sorting */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
        
        {/* Filter panel (hidden by default) */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
            <h3 className="font-medium mb-3">Filter Options</h3>
            {/* Add filter options here */}
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <div className="flex gap-2">
                  <input type="range" className="w-full" min="0" max="1000" />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Brand</h4>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Brand 1</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Brand 2</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Brand 3</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Rating</h4>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">4 stars & up</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">3 stars & up</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Products grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-true-blue"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => handlePageChange(1)}
              className="mt-2 text-blue-600 hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No products found</h2>
            <p className="text-gray-500">We couldn't find any {category} products at the moment.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    &lt;
                  </button>
                  
                  {[...Array(totalPages).keys()].map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded ${
                        currentPage === page + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    &gt;
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

export default CategoryProducts;