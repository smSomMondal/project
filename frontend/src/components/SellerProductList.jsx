import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function SellerProductList() {
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();

    if (location.state?.success) {
      setSuccessMessage("✅ Product added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }, [location.state]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/seller");
      setProducts(res.data);
    } catch (error) {
      //console.error("Failed to fetch products", error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts(products.filter((p) => p._id !== productId));
        alert("❌ Product deleted successfully!");
      } catch (error) {
        //console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product) => {
    navigate(`/seller/edit-product/${product._id}`, { state: { product } });
  };

  const handlePreview = (product) => {
    navigate(`/seller/preview-product/${product._id}`, { state: { product } });
  };

  const goToDashboard = () => {
    navigate("/seller/dashboard");
  };

  return (
    <div className="p-5 max-w-6xl mx-auto font-sans">
      <h2 className="text-3xl font-bold mb-4">🛍️ Seller Product List</h2>
      {successMessage && <div className="text-green-700 font-bold bg-green-100 p-2.5 border border-green-300 rounded-md mb-5">{successMessage}</div>}

      <button className="mb-5 bg-gray-200 border-none py-2.5 px-4 cursor-pointer rounded-md text-sm" onClick={goToDashboard}>← Back to Dashboard</button>

      {products.length === 0 ? (
        <p className="text-lg text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-center transition-shadow duration-300 ease-in-out hover:shadow-lg" key={product._id}>
              <img src={product.imageUrl} alt={product.name} className="w-full h-44 object-cover rounded-md mb-2.5" />
              <h4 className="text-lg font-semibold">{product.name}</h4>
              <p className="text-base">₹ {product.price}</p>
              <p className="text-base">Status: <strong className={product.inStock ? 'text-green-600' : 'text-red-600'}>{product.inStock ? "In Stock" : "Out of Stock"}</strong></p>
              <div className="mt-2.5 flex flex-col gap-2">
                <button className="py-2 px-4 border-none rounded-md cursor-pointer text-white font-bold bg-purple-600" onClick={() => handlePreview(product)}>👁️ Preview</button>
                <button className="py-2 px-4 border-none rounded-md cursor-pointer text-white font-bold bg-yellow-500" onClick={() => handleEdit(product)}>✏️ Edit</button>
                <button className="py-2 px-4 border-none rounded-md cursor-pointer text-white font-bold bg-red-600" onClick={() => handleDelete(product._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerProductList; 