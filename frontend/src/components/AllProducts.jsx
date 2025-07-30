import { useState, useEffect } from "react";
import axios from "axios";

// Modal Component for Editing
const EditProductModal = ({ product, onClose, onUpdate }) => {
    const [formData, setFormData] = useState(product);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                            <input type="text" name="subcategory" value={formData.subcategory} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;
            // Use the public endpoint for buyers (no token required)
            const { data } = await axios.put("/product/getProduct", {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            //console.log(data);
            
            setProducts(data.product);
            setError(null);
        } catch (err) {
            setError("Failed to fetch products. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const token = user?.token;
                if (!token) throw new Error("Authentication token not found.");

                await axios.post(`/product/deleteProduct`, { _id: id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                fetchProducts(); // Refetch products to update the list
            } catch (error) {
                setError("Failed to delete product. Please try again.");
            }
        }
    };

    const handleUpdate = async (updatedProduct) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;
            if (!token) throw new Error("Authentication token not found.");

            await axios.post(
                `/product/updateProduct`, updatedProduct,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            setError(`Failed to update product. Please try again.`);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={handleUpdate}
                />
            )}
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Products</h1>
                <p className="text-gray-600 mb-8">View, edit, or delete your product listings.</p>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">{error}</div>}

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="4" className="text-center py-10">Loading products...</td></tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={product.imagesUrl[0] || 'https://via.placeholder.com/150'} alt={product.name} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500">{product.brand}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{product.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button onClick={() => setEditingProduct(product)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {!loading && filteredProducts.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No products found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AllProductsPage; 