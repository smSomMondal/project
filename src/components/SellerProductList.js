import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./SellerProductList.css"; // Import the CSS file

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
    <div className="seller-container">
      <h2>🛍️ Seller Product List</h2>
      {successMessage && <div className="success-msg">{successMessage}</div>}

      <button className="back-btn" onClick={goToDashboard}>← Back to Dashboard</button>

      {products.length === 0 ? (
        <p className="empty-msg">No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <h4>{product.name}</h4>
              <p>₹ {product.price}</p>
              <p>Status: <strong>{product.inStock ? "In Stock" : "Out of Stock"}</strong></p>
              <div className="product-actions">
                <button className="preview-btn" onClick={() => handlePreview(product)}>👁️ Preview</button>
                <button className="edit-btn" onClick={() => handleEdit(product)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerProductList;
