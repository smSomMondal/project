import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import logo from '../../imgLogo/logo.png';
import { FiPackage, FiTrendingUp, FiUsers, FiDollarSign, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

const OrderList = ({ data }) => {
    const handleAccept = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/approveSeler",
                { cartId: data._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                window.location.reload();
            }
        } catch (err) {
            //console.error("Error fetching products:", err);
        }
    };

    const handleCancel = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/cancelSeler",
                { cartId: data._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                window.location.reload();
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    return (
        <div className="w-full flex flex-row items-center justify-around gap-2.5">
            <div className="flex-grow grid grid-cols-2 gap-2.5 text-center p-2.5">
                <div>
                    <div className="text-sm font-semibold">Quantity</div>
                    <div className="text-xs">{data.items.quantity}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold">Total Price</div>
                    <div className="text-xs">{data.totalPrice}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold">Stage</div>
                    <div className="text-xs">{data.stage}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold">Price that time</div>
                    <div className="text-xs">{data.items.priceAtTime}</div>
                </div>
            </div>
            <div className="flex flex-col gap-2.5 p-2.5">
                <button onClick={handleAccept} className="px-5 py-2.5 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600">Accept</button>
                <button onClick={handleCancel} className="px-5 py-2.5 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600">Cancel</button>
            </div>
        </div>
    );
};

const Card = ({ data }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start overflow-auto scrollbar-hide">
            <div className="w-full flex flex-col gap-4 items-center">
                {data.map((item) => (
                    <div key={item._id} className="bg-purple-600 flex items-center justify-center flex-col text-center h-fit w-full rounded-lg text-white cursor-pointer transition-transform duration-400 hover:scale-105 group-hover:blur-sm group-hover:scale-90 hover:!blur-none hover:!scale-105">
                        <OrderList data={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

function DetailPageSeller() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const storedData = JSON.parse(localStorage.getItem("user"));
            if (!storedData?.token) {
                navigate('/login');
                return;
            }
            
            const token = storedData.token;
            const { data } = await axios.put(
                "http://localhost:5000/product/getProductInfo",
                { pId: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setProducts(data.product);
        } catch (err) {
            console.error("Error fetching product:", err);
            setError("Failed to load product details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !products) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || "Product not found"}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const totalOrders = products.orderList?.length || 0;
    const totalRevenue = products.orderList?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0;
    const pendingOrders = products.orderList?.filter(order => order.stage === 'PENDING')?.length || 0;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-indigo-600 hover:text-indigo-800 mb-4"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <FiPackage className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <FiDollarSign className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-semibold text-gray-900">₹{totalRevenue}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <FiUsers className="h-8 w-8 text-purple-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                                <p className="text-2xl font-semibold text-gray-900">{pendingOrders}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <FiTrendingUp className="h-8 w-8 text-indigo-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Stock Level</p>
                                <p className="text-2xl font-semibold text-gray-900">{products.stock}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>
                                <div className="flex space-x-2">
                                    <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100">
                                        <FiEdit className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
                                        <FiTrash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={products.imagesUrl?.[0] || logo}
                                        alt={products.name}
                                        className="w-32 h-32 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = logo;
                                        }}
                                    />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{products.name}</h3>
                                        <p className="text-gray-600">{products.brand}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-600">Price:</span>
                                            <span className="text-sm text-gray-900">₹{products.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-600">Category:</span>
                                            <span className="text-sm text-gray-900">{products.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-600">Subcategory:</span>
                                            <span className="text-sm text-gray-900">{products.subcategory}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-600">Stock:</span>
                                            <span className={`text-sm font-medium ${
                                                products.stock > 10 ? 'text-green-600' : 
                                                products.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                                {products.stock} units
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Description:</p>
                                        <p className="text-sm text-gray-900">{products.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Orders ({totalOrders})</h2>
                        </div>
                        <div className="p-6">
                            {products.orderList && products.orderList.length > 0 ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {products.orderList.map((order) => (
                                        <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Order #{order._id.slice(-6)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    order.stage === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.stage === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    order.stage === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {order.stage}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                                <div>
                                                    <span className="text-gray-600">Quantity:</span>
                                                    <span className="ml-2 font-medium">{order.items?.quantity || 0}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Total:</span>
                                                    <span className="ml-2 font-medium">₹{order.totalPrice || 0}</span>
                                                </div>
                                            </div>
                                            {order.stage === 'PENDING' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleAcceptOrder(order)}
                                                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectOrder(order)}
                                                        className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                                    <p className="mt-1 text-sm text-gray-500">Orders for this product will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    async function handleAcceptOrder(order) {
        try {
            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/approveSeler",
                { cartId: order._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                fetchProducts(); // Refresh the data
            }
        } catch (err) {
            console.error("Error accepting order:", err);
        }
    }

    async function handleRejectOrder(order) {
        try {
            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/cancelSeler",
                { cartId: order._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                fetchProducts(); // Refresh the data
            }
        } catch (err) {
            console.error("Error rejecting order:", err);
        }
    }
}

export default DetailPageSeller;
