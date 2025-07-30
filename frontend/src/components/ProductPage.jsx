import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ProductPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        stock: "",
        imagesUrl: [], // Changed to an array for multiple images
    });

    const categories = {
        Fashion: ["Men Clothing", "Women Clothing", "Kids Clothing"],
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === "category" && { subcategory: "" }), // Reset subcategory when category changes
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET_NAME); 

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUDE_KEY}/image/upload`, // Replace with your cloud name
                {
                    method: "POST",
                    body: uploadFormData,
                }
            );
            const data = await res.json();
            //console.log(data);
            const newImageUrl = data.url;
            setImageUrl(newImageUrl); // For preview
            setFormData(prev => ({
                ...prev,
                imagesUrl: newImageUrl, // Storing as an array
            }));
        } catch (err) {
            setError("Image upload failed. Please try again.");
            //console.error("Upload Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.imagesUrl.length === 0) {
            setError("Please upload at least one image.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const storedData = JSON.parse(localStorage.getItem("user"));
            if (!storedData?.token) throw new Error("No auth token found");

            await axios.post("/product/addProduct", formData, {
                headers: {
                    Authorization: `Bearer ${storedData.token}`,
                    "Content-Type": "application/json",
                },
            });
            navigate("/", { state: { success: true } }); // Navigate to seller dashboard on success
        } catch (error) {
            setError("Failed to add product. Please check your inputs and try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";
    const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <main className="bg-gray-50 min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Add a New Product</h1>
                    <p className="text-gray-600 mb-8">Fill out the details below to list a new item for sale.</p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className={labelStyle}>Product Name</label>
                                <input id="name" name="name" placeholder="e.g., Modern T-Shirt" value={formData.name} onChange={handleChange} required className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="brand" className={labelStyle}>Brand</label>
                                <input id="brand" name="brand" placeholder="e.g., Gemini" value={formData.brand} onChange={handleChange} required className={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className={labelStyle}>Description</label>
                            <textarea id="description" name="description" placeholder="A brief description of the product..." value={formData.description} onChange={handleChange} required rows="4" className={inputStyle}></textarea>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className={labelStyle}>Price (₹)</label>
                                <input id="price" name="price" type="number" placeholder="e.g., 999" value={formData.price} onChange={handleChange} required className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="stock" className={labelStyle}>Stock</label>
                                <input id="stock" name="stock" type="number" placeholder="e.g., 100" value={formData.stock} onChange={handleChange} required className={inputStyle} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="category" className={labelStyle}>Category</label>
                                <select id="category" name="category" value={formData.category} onChange={handleChange} required className={inputStyle}>
                                    <option value="">Select Category</option>
                                    {Object.keys(categories).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="subcategory" className={labelStyle}>Subcategory</label>
                                <select id="subcategory" name="subcategory" value={formData.subcategory} onChange={handleChange} required disabled={!formData.category} className={`${inputStyle} disabled:bg-gray-200`}>
                                    <option value="">Select Subcategory</option>
                                    {formData.category && categories[formData.category].map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={labelStyle}>Product Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
                                    ) : (
                                        <UploadIcon />
                                    )}
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                            >
                                {loading ? "Adding Product..." : "Add Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ProductPage; 