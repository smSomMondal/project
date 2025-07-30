import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCardSeller from "../productCard/ProductCardSeller.jsx";
import EditProductModal from '../AllProducts.jsx';

function ProductListSeller() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [orders, setOrders] = useState([]);

    const fetchProducts = async () => {
        try {
            // Get user data from localStorage
            /*const storedData = JSON.parse(localStorage.getItem('user'));
            if (!storedData?.token) {
                throw new Error("Authentication token not found.");
            }
            
            // Check if user is a seller
            if (storedData.userType !== "seller") {
                throw new Error("You must be logged in as a seller to view this page.");
            }
            
            const token = storedData.token;
            setLoading(true);
            console.log("Attempting to fetch products as seller with token:", token.substring(0, 10) + "...");
            
            // Test if the server is reachable first
            /*try {
                await axios.get("http://localhost:5000/product/getProductUser");
                console.log("Server is reachable");
            } catch (serverErr) {
                console.log("Server connection test failed:", serverErr.message);
                if (serverErr.code === "ERR_NETWORK") {
                    throw new Error("Cannot connect to the server. Please make sure the backend server is running.");
                }
            }*/

            // Fetch products for the seller
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;
            const response = await axios.put("http://localhost:5000/product/getProduct", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            //console.log("API Response:", response.status, response.data);

            if (response.data && response.data.sellerInfo) {
                //console.log("Seller Info:", response.data.sellerInfo);
                //console.log("Current User ID:", storedData._id);
            }

            if (response.data && response.data.product) {
                //console.log("Products received:", response.data.product.length);
                setProducts(response.data.product);
                setError(null);

                // If no products, log additional info
                if (response.data.product.length === 0) {
                    //console.log("User ID from token:", storedData._id);
                    //console.log("User Type:", storedData.userType);
                }
            } else {
                //console.warn("No products found in response:", response.data);
                setProducts([]);
            }
        } catch (err) {
            /*let errorMessage = "Failed to fetch products. Please log in and try again.";
            
            if (err.code === "ERR_NETWORK") {
                errorMessage = "Cannot connect to server. Please ensure the backend is running.";
            } else if (err.response) {
                // Server responded with an error status
                console.log("Server error response:", err.response.status, err.response.data);
                
                if (err.response.status === 401) {
                    errorMessage = "Authentication failed. Please log in again.";
                } else if (err.response.status === 403) {
                    errorMessage = "You don't have permission to view this content. Please log in as a seller.";
                } else if (err.response.status === 500) {
                    errorMessage = "Server error. Please try again later.";
                }
                
                // Use custom error message from server if available
                if (err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            console.error("Error fetching products:", err);*/
            //console.log(err);

        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (updatedProduct) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;
            if (!token) throw new Error("Authentication token not found.");
            await axios.post(
                `http://localhost:5000/product/updateProduct`, updatedProduct,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            setError(`Failed to update product. Please try again.`);
        }
    };

    const fetchOrders = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;
            if (!token) throw new Error("Authentication token not found.");
            const res = await axios.put("/product/getProduct", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res);
            const allOrders = [];
            res.data.product.forEach(pr => {
                // pr.orderList.forEach(or => {
                //     allOrders.push({
                //         ...or, // destructure if needed
                //     });
                // });
                allOrders.push({
                    ...pr,
                })
            });

            console.log(allOrders);

            setOrders(allOrders || []);
            //setOrders(allOrders || []);
        } catch (err) {
            setOrders([]);
        }
    };

    const handleApprove = async (orderId) => {
        try {
            console.log(orderId);
            
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;
            const res = await axios.post(
                "/cart/approveSeler",
                {
                    cartId:orderId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            //console.log(res);
            if (res.status === 200) {
                window.location.reload();
            } // Refresh the order list
        } catch (err) {
            alert("Failed to approve order.");
        }
    };
    const handleCancel = async (orderId) => {
        try {
            console.log(orderId);
            
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;
            const res = await axios.post(
                "/cart/cancelSeler",
                {
                    cartId: orderId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            //console.log(res);
            if (res.status === 200) {
                window.location.reload();
            }
        } catch (err) {
            alert("Failed to approve order.");
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const storedData = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-8">
                {/* Orders Table */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Order Requests</h2>
                    {
                        orders.length > 0 ? (<>
                        <br/>
                            {
                                orders.map(products => (
                                    <div className="overflow-x-auto bg-white rounded-2xl shadow-md space-y-4 my-8">
                                        <div className="flex flex-row flex-wrap justify-evenly p-6  space-y-4">
                                            <div className="flex items-center basis-1/3 justify-center pb-2 gap-4">
                                                <span className="font-semibold text-gray-700">Name</span>
                                                <span className="text-gray-900">{products.name}</span>
                                            </div>
                                            <div className="flex items-center basis-1/3 justify-center pb-2 gap-4">
                                                <span className="font-semibold text-gray-700">Brand</span>
                                                <span className="text-gray-900">{products.brand}</span>
                                            </div>
                                            <div className="flex items-center basis-1/3 justify-center pb-2 gap-4">
                                                <span className="font-semibold text-gray-700">Category</span>
                                                <span className="text-gray-900">{products.category}</span>
                                            </div>
                                            <div className="flex items-center basis-1/2 justify-center pb-2 gap-4">
                                                <span className="font-semibold text-gray-700">Subcategory</span>
                                                <span className="text-gray-900">{products.subcategory}</span>
                                            </div>
                                            <div className="flex items-center basis-1/2 justify-center pb-2 gap-4">
                                                <span className="font-semibold text-gray-700">In Stock</span>
                                                <span className="text-gray-900">{products.stock}</span>
                                            </div>
                                        </div>
                                        {products.orderList.length > 0 ? (<table className="min-w-full bg-white rounded-lg shadow-md">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2">Quantity</th>
                                                    <th className="px-4 py-2">Tota Prise</th>
                                                    <th className="px-4 py-2">Cancel</th>
                                                    <th className="px-4 py-2">Approve</th>
                                                    <th className="px-4 py-2">Date</th>
                                                </tr>
                                            </thead>
                                            {/* {JSON.stringify(orders)} */}
                                            <tbody>
                                                {products.orderList.map(order => (
                                                    <tr key={order._id + '-'}>
                                                        <td className="border px-4 py-2">{order.items.quantity || 'N/A'}</td>
                                                        <td className="border px-4 py-2">{order.totalPrice || 'N/A'}</td>
                                                        <td className="border px-4 py-2">
                                                        {order.stage === "ORDERED" && (
                                                                <button
                                                                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                                                                    onClick={() => handleCancel(order._id)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                            </td>
                                                        <td className="border px-4 py-2">
                                                            {order.stage === "ORDERED" && (
                                                                <button
                                                                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                                                    onClick={() => handleApprove(order._id)}
                                                                >
                                                                    Approve
                                                                </button>
                                                            )}
                                                            {order.stage}
                                                        </td>
                                                        <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        
                                        ) : (<div className="text-gray-500">No Active order requests found.</div>)
                                        }
                                    </div>
                                ))
                            }

                        </>) : (<div className="text-gray-500">No Product Added Yet.</div>)
                    }
                    
                </div>
            </div>
        </main>
    );
}

export default ProductListSeller; 