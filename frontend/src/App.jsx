import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import ProductPage from "./components/ProductPage.jsx";
import AllProducts from "./components/AllProducts.jsx";
import ProductList from "./components/ProductList.jsx";
import Login from "./components/login/Login.jsx";
import Signup from "./components/login/Signup.jsx";
// import ProductCard from "./components/productCard/ProductCard.jsx";
import OrderCard from "./components/productCard/OrderCard.jsx";
import CartPage from "./components/CartPage.jsx";
import NavbarSeller from "./components/navbar/NavbarSeller.jsx";
import NavbarBuyer from "./components/navbar/NavbarBuyer.jsx";
import AdminLogin from "./components/admin/AdminLogin.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import ProductListBuyer from "./components/productList/ProductListBuyer.jsx";
import ProductDetails from "./components/productList/ProductDetails.jsx";
import UpdateUser from "./components/login/UpdateUser.jsx";
import ParchesListBuyer from "./components/productList/ParchesListBuyer.jsx";
import ProductListSeller from "./components/productList/ProductListSeller.jsx";
import DetailPageSeller from "./components/productList/DetailPageSeller.jsx";
import About from "./components/productCard/About.jsx";
import Profile from "./components/login/Profile.jsx";
import Home from "./components/pages/Home.jsx";
// import { useUser } from "./context/userContext.jsx";
import OrderHistory from "./components/orders/OrderHistory.jsx";

const PrivetComponentBuyer = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  return storedUser ? <Outlet /> : <Navigate to={"/login"} />;
};

const PrivetComponentSeller = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  return storedUser?.userType === "seller" ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} />
  );
};

const PrivateAdminRoute = () => {
  const adminToken = localStorage.getItem("adminToken");
  return adminToken ? <Outlet /> : <Navigate to={"/admin/login"} />;
};

function App() {
  const [userType, setUsertype] = useState();
  // const { logOut } = useUser();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      return;
    }
    setUsertype(storedUser.userType);
  }, []);

  return (
    <div className="font-sans box-border min-h-screen w-full">
      <BrowserRouter>
        {userType === "seller" && <NavbarSeller />}
        {userType !== "seller" && !localStorage.getItem("adminToken") && (
          <NavbarBuyer />
        )}
        <div className="w-full box-border flex flex-col">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<PrivateAdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Seller Routes */}
            {userType === "seller" ? (
              <>
                <Route path="/" element={<ProductListSeller />} />
                <Route element={<PrivetComponentSeller />}>
                  <Route path="/add" element={<ProductPage />} />
                  <Route path="/update" element={<AllProducts />} />
                  <Route path="/detail/:id" element={<DetailPageSeller />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                </Route>
              </>
            ) : (
              <>
                {/* Buyer Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/products" element={<ProductListBuyer />} />
                <Route element={<PrivetComponentBuyer />}>
                  <Route path="/detail" element={<ProductDetails />} />
                  <Route path="/sarchPro" element={<ProductList />} />
                  <Route path="/updateAddress" element={<UpdateUser />} />
                  <Route path="/order/:id" element={<OrderCard />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/parches" element={<ParchesListBuyer />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                </Route>
              </>
            )}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;