import { Routes, Route, Link } from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import Layout from "./Components/common/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProtectedRoute from "./Components/common/ProtectedRoute";
import Profile from "./Pages/Profile";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Shop from "./Pages/Shop";
import ProductDetails from "./Pages/ProductDetails";

import AdminLayout from "./Components/admin/AdminLayout";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminProductPage from "./Pages/Admin/AdminProductPage";
import AdminCreateProduct from "./Pages/Admin/AdminCreateProduct";
import AdminProductDetailPAge from "./Pages/Admin/AdminProductDetailPage";
import AdminProtectedRoute from "./Components/admin/AdminProtectedRoute";
import AdminLogin from "./Pages/Admin/AdminLogin";
import ContactPage from "./Pages/Contact";
import AdminCategoryPage from "./Pages/Admin/AdminCategoryPage";
import AdminCreateCategoryPage from "./Pages/Admin/AdminCreateCategory";

function App() {
  return (
    <>
    <Routes> 

      <Route element={<Layout/>}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
        <Route path="/shop/category/:category" element={<Shop/>}/>
        <Route path="/shop/:id" element={<ProductDetails/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }/>
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }/>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }/>
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminProtectedRoute />}>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductPage />} />
          <Route path="products/create" element={<AdminCreateProduct />} />
          <Route path="products/:id" element={<AdminProductDetailPAge />} />
          <Route path="categories" element={<AdminCategoryPage />} />
          <Route path="categories/create" element={<AdminCreateCategoryPage />} />
          <Route path="categories/edit/:id" element={<AdminCreateCategoryPage />} />
        </Route>

      </Route>

    </Routes>
    <ToastContainer/>
    </>
  );
}

export default App;
