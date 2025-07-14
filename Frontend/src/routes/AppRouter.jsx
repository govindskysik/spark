import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CategoryPage from '../pages/CategoryPage';
import ProductDetail from '../pages/ProductDetail';
import CartPage from '../pages/CartPage'; // ✅ Import

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/category/:categoryName" element={<CategoryPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} /> {/* ✅ Add this */}
    </Routes>
  );
};

export default AppRouter;
