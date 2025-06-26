import { useState, useEffect } from "react";
import axios from "axios";
import "./ProductPage.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {

    const navi = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        stock: "",
        imagesUrl: "",
    });

    const categories = {
        Clothing: ["Men Clothing", "Women Clothing", "Kids Clothing"],
        Footwear: ["Men Footwear", "Women Footwear", "Kids Footwear"],
        Electronics: [
            "Mobiles & Tablets",
            "Laptops & Computers",
            "TV & Home Entertainment",
        ],
        "Home & Kitchen": ["Kitchen Appliances", "Home Decor", "Furniture"],
        "Beauty & Personal Care": ["Makeup", "Skincare", "Haircare"],
        "Sports & Fitness": ["Fitness Equipment", "Sportswear"],
        "Baby Products": ["Diapers", "Baby Toys"],
        "Grocery & Essentials": ["Snacks", "Staples"],
        "Gaming & Entertainment": ["Video Games", "Gaming Accessories"],
        "Books & Stationery": ["Fiction", "Stationery"],
        Automotive: ["Car Accessories", "Bike Accessories"],
    };

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
            setProducts(data.product);
            console.log(data.product);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "category") {
            setFormData({
                ...formData,
                category: value,
                subcategory: "", // Reset subcategory when category changes
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handelUplode = async (e) => {
        // console.log(e.target.files[0]);
        // const file = e.target.files[0];
        // if(!file) return

        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "PresetName"); // Replace with your actual preset

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/cloudName/image/upload", // Replace with your cloud name
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            setImageUrl(data.secure_url);
            setFormData((prev) => ({
                ...prev,
                imagesUrl: data.secure_url,
            }));
            console.log(res);
        } catch (err) {
            console.error("Upload Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);

            const storedData = JSON.parse(localStorage.getItem("token"));
            const token = storedData?.token;
            setLoading(true);
            await axios.post("http://localhost:5000/product/addProduct", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            fetchProducts();
            setFormData({
                name: "",
                description: "",
                price: "",
                pId: "",
                category: "",
                subcategory: "",
                stock: "",
                sellerId: "",
                imagesUrl: "",
            });
            setError(null);
        } catch (error) {
            setError("Failed to add product. Please try again.");
            console.error("Error adding product:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            navi('/update')
        }
    };

    return (
        <div className="product-page">
            <h2>Product Management</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="product-form-container">
                <h3>Add New Product</h3>
                <div className="product-form">
                    <div className="form-group">
                        <input
                            name="name"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="brand"
                            placeholder="Brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="description"
                            placeholder="Product Description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="price"
                            type="number"
                            placeholder="Price (₹)"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {Object.keys(categories).map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            required
                            disabled={!formData.category}
                        >
                            <option value="">Select Subcategory</option>
                            {formData.category &&
                                categories[formData.category].map((subcategory) => (
                                    <option key={subcategory} value={subcategory}>
                                        {subcategory}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <input
                            name="stock"
                            type="number"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <StyledWrapper>
                            <div>
                                <label htmlFor="file" className="labelFile">
                                    <span>
                                        <svg
                                            xmlSpace="preserve"
                                            viewBox="0 0 184.69 184.69"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            xmlns="http://www.w3.org/2000/svg"
                                            id="Capa_1"
                                            version="1.1"
                                            width="60px"
                                            height="60px"
                                        >
                                            <g>
                                                <g>
                                                    <g>
                                                        <path
                                                            d="M149.968,50.186c-8.017-14.308-23.796-22.515-40.717-19.813
                                                        C102.609,16.43,88.713,7.576,73.087,7.576c-22.117,0-40.112,17.994-40.112,40.115c0,0.913,0.036,1.854,0.118,2.834
                                                        C14.004,54.875,0,72.11,0,91.959c0,23.456,19.082,42.535,42.538,42.535h33.623v-7.025H42.538
                                                        c-19.583,0-35.509-15.929-35.509-35.509c0-17.526,13.084-32.621,30.442-35.105c0.931-0.132,1.768-0.633,2.326-1.392
                                                        c0.555-0.755,0.795-1.704,0.644-2.63c-0.297-1.904-0.447-3.582-0.447-5.139c0-18.249,14.852-33.094,33.094-33.094
                                                        c13.703,0,25.789,8.26,30.803,21.04c0.63,1.621,2.351,2.534,4.058,2.14c15.425-3.568,29.919,3.883,36.604,17.168
                                                        c0.508,1.027,1.503,1.736,2.641,1.897c17.368,2.473,30.481,17.569,30.481,35.112c0,19.58-15.937,35.509-35.52,35.509H97.391
                                                        v7.025h44.761c23.459,0,42.538-19.079,42.538-42.535C184.69,71.545,169.884,53.901,149.968,50.186z"
                                                            style={{ fill: "#010002" }}
                                                        />
                                                    </g>
                                                    <g>
                                                        <path
                                                            d="M108.586,90.201c1.406-1.403,1.406-3.672,0-5.075L88.541,65.078
                                                        c-0.701-0.698-1.614-1.045-2.534-1.045l-0.064,0.011c-0.018,0-0.036-0.011-0.054-0.011c-0.931,0-1.85,0.361-2.534,1.045
                                                        L63.31,85.127c-1.403,1.403-1.403,3.672,0,5.075c1.403,1.406,3.672,1.406,5.075,0L82.296,76.29v97.227
                                                        c0,1.99,1.603,3.597,3.593,3.597c1.979,0,3.59-1.607,3.59-3.597V76.165l14.033,14.036
                                                        C104.91,91.608,107.183,91.608,108.586,90.201z"
                                                            style={{ fill: "#010002" }}
                                                        />
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </span>
                                    <p>drag and drop your file here or click to select a file!</p>
                                </label>
                                <input
                                    className="input"
                                    name="text"
                                    id="file"
                                    type="file"
                                    onChange={(e) => handelUplode(e)}
                                />
                                <img
                                    src={imageUrl}
                                    alt="Uploaded"
                                    style={{ maxWidth: "300px", marginTop: "10px" }}
                                />
                            </div>
                        </StyledWrapper>
                    </div>
                    <div className="form-group">
                        <input
                            name="imagesUrl"
                            placeholder="Image URL"
                            value={formData.imagesUrl}
                        />
                    </div>
                    <button onClick={handleSubmit}>Add Product</button>
                </div>
            </div>

            <div className="products-container">
                <h3>Product List</h3>
                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        No products found. Add your first product above.
                    </div>
                ) : (
                    <div className="product-list">
                        {products.map((product) => (
                            <div key={product._id} className="product-card">
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Delete
                                </button>
                                <img src={product.imagesUrl} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>
                                    <strong>Product ID:</strong> {product.pId}
                                </p>
                                <p>
                                    <strong>₹{product.price}</strong>
                                </p>
                                <p>{product.description}</p>
                                <p>
                                    <strong>Category:</strong> {product.category}
                                </p>
                                <p>
                                    <strong>Subcategory:</strong> {product.subcategory}
                                </p>
                                <p>
                                    <strong>Stock:</strong> {product.stock}
                                </p>
                                <p>
                                    <strong>Seller ID:</strong> {product.sellerId}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPage;

const StyledWrapper = styled.div`
  .input {
    max-width: 190px;
    display: none;
  }

  .labelFile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 250px;
    height: 190px;
    border: 2px dashed #ccc;
    align-items: center;
    text-align: center;
    padding: 5px;
    color: #404040;
    cursor: pointer;
  }
`;
