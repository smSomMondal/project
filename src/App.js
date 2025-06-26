import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import ProductPage from "./components/ProductPage";
import AllProducts from "./components/AllProducts";
import ProductList from "./components/ProductList";
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";
import ProductCard from "./components/productCard/ProductCard";
import OrderCard from "./components/productCard/OrderCard";
import CartPage from "./components/CartPage";
import NavbarSeller from "./components/navbar/NavbarSeller";
import NavbarBuyer from "./components/navbar/NavbarBuyer";
import ProductListBuyer from "./components/productList/ProductListBuyer";
import ProductDetails from "./components/productList/ProductDetails";
import UpdateUser from "./components/login/UpdateUser";
import ParchesListBuyer from "./components/productList/ParchesListBuyer";
import ProductListSeller from "./components/productList/ProductListSeller";
import DetailPageSeller from "./components/productList/DetailPageSeller";
import About from "./components/productCard/About";
import { useUser } from "./context/userContext";
const PrivetComponentBuyer = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  return storedUser ? <Outlet /> : <Navigate to={"/login"} />;
};
const PrivetComponentSeller = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  return storedUser.userType === "seller" ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} />
  );
};

function App() {
  const [userType, setUsertype] = useState();
  const{logOut}=useUser()
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      return;
    }
    console.log(storedUser);

    setUsertype(storedUser.userType);
     /*window.addEventListener("beforeunload", logOut);
    return()=>{
      window.removeEventListener("beforeunload", logOut);
    }*/
  }, []);
  return (
    <>
      <div className="App">
        {userType && userType === "seller" ? (
          <BrowserRouter>
            <NavbarSeller />
            <div className="inside">
              <Routes>
                <Route path="/" element={<ProductListSeller />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<PrivetComponentSeller />}>
                  <Route path="/add" element={<ProductPage />} />
                  <Route path="/update" element={<AllProducts />} />
                  <Route path="/detail/:id" element={<DetailPageSeller />} />
                  <Route path="/about" element={<About />} />
                </Route>
              </Routes>
            </div>
          </BrowserRouter>
        ) : (
          <BrowserRouter>
            <NavbarBuyer />
            <div className="inside">
              <Routes>
                <Route path="/" element={<ProductListBuyer />} />
                <Route path="/home" element={<ProductListBuyer />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<PrivetComponentBuyer />}>
                  <Route path="/detail" element={<ProductDetails />} />
                  <Route path="/allCarts" element={<ProductListBuyer />} />
                  <Route path="/sarchPro" element={<ProductList />} />
                  <Route path="/updateAddress" element={<UpdateUser />} />
                  <Route path="/product" element={<ProductCard />} />
                  <Route path="/order/:id" element={<OrderCard />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/parches" element={<ParchesListBuyer />} />
                  <Route path="/about" element={<About />} />
                </Route>
              </Routes>
            </div>
          </BrowserRouter>
        )}
      </div>
    </>
  );
}

export default App;
