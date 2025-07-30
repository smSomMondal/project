import React, { useState, useEffect } from 'react';
import logo from '../../imgLogo/logo.png';
import { useProduct } from '../../context/productContext.jsx';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiShoppingBag, FiStar, FiShield, FiTruck, FiRotateCcw } from 'react-icons/fi';

function ProductDetails() {
    const { tarProduct } = useProduct();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);

    const { name, brand, description, price, category, stock, subcategory } = tarProduct;
    // Ensure imagesUrl is always an array
    const imageList = Array.isArray(tarProduct.imagesUrl) ? tarProduct.imagesUrl : (tarProduct.imagesUrl ? [tarProduct.imagesUrl] : []);

    useEffect(() => {
        if (imageList.length > 0) {
            setSelectedImage(imageList[0]);
        }
    }, [tarProduct]);

    if (!tarProduct || Object.keys(tarProduct).length === 0) {
        // If there's no target product in context, redirect to the home page.
        return <Navigate to="/" />;
    }

    const handleBuy = async () => {
        try {
            setIsBuyingNow(true);
            const storedData = JSON.parse(localStorage.getItem("user"));
            if (!storedData?.token) throw new Error("Not logged in");
            
            const res = await axios.post(
                "/cart/add",
                { productId: tarProduct._id, quantity: quantity },
                { headers: { Authorization: `Bearer ${storedData.token}` } }
            );

            if (res.status === 200 || res.status === 201) {
                navigate('/cart');
            }
        } catch (error) {
            navigate('/login');
        } finally {
            setIsBuyingNow(false);
        }
    };

    const addToCart = async () => {
        try {
            setIsAddingToCart(true);
            const storedData = JSON.parse(localStorage.getItem("user"));
            if (!storedData?.token) throw new Error("Not logged in");

            const res = await axios.post(
                "/cart/add",
                { productId: tarProduct._id, quantity: quantity },
                { headers: { Authorization: `Bearer ${storedData.token}` } }
            );
            console.log(res);
            
            if (res.status === 200 || res.status === 201) {
                // Show success notification
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                notification.textContent = 'Added to cart successfully!';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);
            }
        } catch (error) {
            navigate('/login');
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-lg">
                            <img
                                src={selectedImage || logo}
                                alt={name}
                                className="w-full h-auto object-cover aspect-square"
                                onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                            />
                        </div>
                        <div className="flex space-x-2">
                            {imageList.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-20 overflow-hidden rounded-md border-2 ${selectedImage === img ? 'border-indigo-500' : 'border-transparent'}`}
                                >
                                    <img
                                        src={img}
                                        alt={`${name} thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="flex flex-col justify-center">
                        <nav className="text-sm text-gray-500 mb-4">
                            <span>{category}</span> {subcategory && <span> / {subcategory}</span>}
                        </nav>
                        
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{name}</h1>
                        <p className="text-lg text-gray-600 mb-4">{brand}</p>
                        
                        {/* Rating placeholder */}
                        <div className="flex items-center mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">(4.5 out of 5)</span>
                        </div>
                        
                        <div className="mb-6">
                            <span className="text-3xl font-bold text-gray-900">₹{price}</span>
                        </div>
                        
                        <p className="text-gray-700 text-base leading-relaxed mb-6">
                            {description}
                        </p>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {stock > 0 ? (
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-green-600 font-medium">
                                        {stock > 10 ? 'In Stock' : `Only ${stock} left in stock`}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    <span className="text-red-600 font-medium">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <div className="flex items-center border border-gray-300 rounded-lg w-32">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 text-center flex-1">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                    className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                                    disabled={quantity >= stock}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={addToCart}
                                disabled={isAddingToCart || stock <= 0}
                                className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold py-3 px-6 rounded-lg hover:bg-indigo-50 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <FiShoppingCart className="mr-2" />
                                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={handleBuy}
                                disabled={isBuyingNow || stock <= 0}
                                className="flex-1 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <FiShoppingBag className="mr-2" />
                                {isBuyingNow ? 'Processing...' : 'Buy Now'}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Why shop with us?</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <FiTruck className="h-5 w-5 text-green-500 mr-3" />
                                    <span className="text-sm text-gray-600">Free shipping on orders over ₹999</span>
                                </div>
                                <div className="flex items-center">
                                    <FiRotateCcw className="h-5 w-5 text-green-500 mr-3" />
                                    <span className="text-sm text-gray-600">30-day return policy</span>
                                </div>
                                <div className="flex items-center">
                                    <FiShield className="h-5 w-5 text-green-500 mr-3" />
                                    <span className="text-sm text-gray-600">Secure payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails; 