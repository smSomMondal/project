import { useState, useEffect } from "react";
import axios from "axios";
import "./AllProducts.css";

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchProducts = async () => {
    try {
      const storedData = JSON.parse(localStorage.getItem("token"));
      const token = storedData?.token;
      setLoading(true);
      const { data } = await axios.put(
        "http://localhost:5000/product/getProduct",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const initialEditFormData = {};
      data.product.forEach(product => {
        initialEditFormData[product._id] = { ...product };
      });
      setEditFormData(initialEditFormData);
      setProducts(data.product);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      //console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [products, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const storedData = JSON.parse(localStorage.getItem("token"));
        const token = storedData?.token;
        setLoading(true);
        await axios.post(`http://localhost:5000/product/deleteProduct`,
          { _id: id },
          {headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }}
        );
        fetchProducts();
        setError(null);
      } catch (error) {
        setError("Failed to delete product. Please try again.");
        //console.error("Error deleting product:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (id) => {
    setEditingProductId(id);
  };

  const handleInputChange = (id, name, value) => {
    setEditFormData(prevData => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [name]: value,
      },
    }));
  };

  const handleUpdateSubmit = async (id) => {
    try {

      console.log(editFormData[id])
      const storedData = JSON.parse(localStorage.getItem("token"));
      const token = storedData?.token;
      setLoading(true);
      await axios.post(
        `http://localhost:5000/product/updateProduct`,
        editFormData[id],
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEditingProductId(null);
      fetchProducts();
      setError(null);
    } catch (error) {
      setError(`Failed to update product with ID ${id}. Please try again.`);
      //console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = (id) => {
    setEditingProductId(null);
    setEditFormData(prevData => ({
      ...prevData,
      [id]: { ...products.find(p => p._id === id) },
    }));
  };

  return (
    <div className="all-products-page">
      <h2>Product Management</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="products-container">
        <h3>Product List</h3>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length === 0 && !loading ? (
          <div className="empty-state">No products found.</div>
        ) : (
          <div className="product-list">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={
                    product.imagesUrl ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={product.name}
                />
                <h3>
                  {editingProductId === product._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editFormData[product._id]?.name || ""}
                      onChange={(e) => handleInputChange(product._id, e.target.name, e.target.value)}
                    />
                  ) : (
                    product.name
                  )}
                </h3>
                <p>
                  <strong>Product ID:</strong> {product.pId}
                </p>
                <p>
                  <strong>₹</strong>
                  {editingProductId === product._id ? (
                    <input
                      type="number"
                      name="price"
                      value={editFormData[product._id]?.price || ""}
                      onChange={(e) => handleInputChange(product._id, e.target.name, e.target.value)}
                    />
                  ) : (
                    product.price
                  )}
                </p>
                <p>
                  {editingProductId === product._id ? (
                    <textarea
                      name="description"
                      value={editFormData[product._id]?.description || ""}
                      onChange={(e) => handleInputChange(product._id, e.target.name, e.target.value)}
                    />
                  ) : (
                    product.description
                  )}
                </p>
                <p>
                  <strong>Category:</strong>
                  {editingProductId === product._id ? (
                    <input
                      type="text"
                      name="category"
                      value={editFormData[product._id]?.category || ""}
                      onChange={(e) => handleInputChange(product._id, e.target.name, e.target.value)}
                    />
                  ) : (
                    product.category
                  )}
                </p>
                <p>
                  <strong>Subcategory:</strong>
                  {editingProductId === product._id ? (
                    <input
                      type="text"
                      name="subcategory"
                      value={editFormData[product._id]?.subcategory || ""}
                      onChange={(e) => handleInputChange(product._id, e.target.name, e.target.value)}
                    />
                  ) : (
                    product.subcategory
                  )}
                </p>
                <p>
                  <strong>Stock:</strong>
                  {editingProductId === product._id ? (
                    <input
                      type="number"
                      name="stock"
                      value={editFormData[product._id]?.stock || ""}
                      onChange={(e) => handleInputChange(product._id, e.target.name, parseInt(e.target.value))}
                    />
                  ) : (
                    product.stock
                  )}
                </p>
                {product.sellerId && (
                  <p>
                    <strong>Seller ID:</strong> {product.sellerId}
                  </p>
                )}
                <div className="product-actions">
                  {editingProductId === product._id ? (
                    <>
                      <button className="update-button" onClick={() => handleUpdateSubmit(product._id)}>
                        Update
                      </button>
                      <button className="cancel-button" onClick={() => handleCancelEdit(product._id)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="edit-button" onClick={() => handleEdit(product._id)}>
                      Edit
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;
