import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CategoryPage from '../pages/CategoryPage';
import ProductDetail from '../pages/ProductDetail';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/category/:categoryName" element={<CategoryPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  );
};

export default AppRouter;
