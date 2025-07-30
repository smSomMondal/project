import React, { useState } from 'react'
import axios from 'axios'
import { useProduct } from '../../context/productContext.jsx'
import logo from '../../imgLogo/logo.png'
import { useNavigate } from 'react-router-dom'

function BuyerProductCard({data}) {
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [error, setError] = useState(null);
    const {setTarProduct} = useProduct();
    const navigate = useNavigate();

    const handleClick = (e) => {
        // Prevent card click from firing when button is clicked
        if (e.target.tagName === 'BUTTON') {
            e.stopPropagation();
            return;
        }
        setTarProduct(data);
        navigate('/detail');
    }

    const handleAddToCart = async (e) => {
        e.stopPropagation(); // Prevent navigation when adding to cart
        
        try {
            setIsAddingToCart(true);
            setError(null);

            const storedData = JSON.parse(localStorage.getItem("user"));
            if (!storedData?.token) {
                console.log("here");
                
                //navigate('/login');
                return;
            }

            // Validate product data
            /*if (!data._id || typeof data.price === 'undefined' || typeof data.stock === 'undefined') {
                console.error('Invalid product data:', data);
                throw new Error('Invalid product data');
            }

            // Check if product is in stock
            if (data.stock < 1) {
                throw new Error('Product is out of stock');
            }

            // Prepare request payload
            const cartItem = {
                productId: data._id,
                quantity: 1 // Always adding 1 item initially
            };*/

            //console.log('Sending cart request:', cartItem);
            console.log('Sending cart request:');

            const res = await axios.post(
                "/cart/add",
                {
                    productId: data._id,
                    quantity: 1,
                },
                { 
                    headers: { 
                        Authorization: `Bearer ${storedData.token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );

            if (res.status === 200 || res.status === 201) {
                // Show success message
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
                notification.textContent = 'Added to cart successfully!';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);
            } else {
                throw new Error('Failed to add to cart');
            }
        } catch (error) {
            console.error("Add to cart error:", error.response || error);
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
                return;
            }

            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.message || 
                               "Failed to add product to cart";
            
            setError(errorMessage);
            
            // Show error message
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
            notification.textContent = errorMessage;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div
            className="w-full max-w-sm bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
            onClick={handleClick}
        >
            <div className="overflow-hidden rounded-t-lg relative">
                <img
                    src={data?.imagesUrl || logo}
                    alt={data.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = logo;
                    }}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {data.stock <= 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                        Out of Stock
                    </div>
                )}
                {data.stock > 0 && data.stock <= 5 && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                        Only {data.stock} left
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{data.name}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{data.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">₹{data.price}</span>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || data.stock <= 0}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 
                            ${data.stock <= 0 
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {isAddingToCart ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding...
                            </span>
                        ) : (
                            'Add to Cart'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BuyerProductCard;
