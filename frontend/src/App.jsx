import { Routes, Route, Link } from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import Layout from "./Components/common/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProtectedRoute from "./Components/common/ProtectedRoute";
import Profile from "./Pages/Profile";
import Shop from "./Pages/Shop";
import ProductDetails from "./Pages/ProductDetails";

import AdminLayout from "./Components/admin/AdminLayout";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminProductPage from "./Pages/Admin/AdminProductPage";
import AdminCreateProduct from "./Pages/Admin/AdminCreateProduct";
import AdminProductDetailPAge from "./Pages/Admin/AdminProductDetailPage";

function App() {
  return (
    <>
    <Routes> 

      <Route element={<Layout/>}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop/>}/>
        <Route path="/shop/category/:category" element={<Shop/>}/>
        <Route path="/shop/:id" element={<ProductDetails/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }/>
      </Route>

      <Route element={<AdminLayout/>}>
          <Route path="/admin" element={<AdminDashboard/>}/>
          <Route path="/admin/products" element={<AdminProductPage/>}/>
          <Route path="/admin/products/:id" element={<AdminProductDetailPAge/>}/>
          <Route path="/admin/products/create" element={<AdminCreateProduct/>}/>
      </Route>

    </Routes>
    <ToastContainer/>
    </>
  );
}

export default App;
