import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiArrowRight, FiShield, FiTruck, FiHeart } from 'react-icons/fi';
// import { FiShoppingBag, FiTrendingUp, FiStar, FiArrowRight, FiShield, FiTruck, FiHeart } from 'react-icons/fi';
import BuyerProductCard from '../productCard/BuyerProductCard.jsx';
// import logo from '../../imgLogo/logo.png';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            //console.log("Attempting to fetch featured products...");
            const res = await axios.put("/product/getProductUser", {
                timeout: 10000 // 10 second timeout
            });
            //console.log("Featured products API response:", res.status);
            if (res.data?.product && Array.isArray(res.data.product)) {
                // Get first 8 products as featured
                setFeaturedProducts(res.data.product.slice(0, 8));
                //console.log("Featured products fetched successfully:", res.data.product.length);
            }
        } catch (err) {
            console.error("Error fetching featured products:", err);
            if (err.code === 'ERR_NETWORK') {
                console.log("Network error - please check if the backend server is running on port 5000");
            }
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        {
            name: "Clothing",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
            description: "Fashion for everyone",
            count: "2,000+ items"
        },
        {
            name: "Electronics",
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
            description: "Latest tech gadgets",
            count: "1,500+ items"
        },
        {
            name: "Home & Kitchen",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
            description: "Everything for your home",
            count: "3,000+ items"
        },
        {
            name: "Beauty & Personal Care",
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
            description: "Beauty essentials",
            count: "800+ items"
        }
    ];

    const features = [
        {
            icon: FiShield,
            title: "Secure Shopping",
            description: "Your data and payments are always protected"
        },
        {
            icon: FiTruck,
            title: "Fast Delivery",
            description: "Quick and reliable shipping nationwide"
        },
        {
            icon: FiHeart,
            title: "Quality Products",
            description: "Carefully curated items from trusted sellers"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-screen bg-slate-800/10 text-white overflow-hidden">
                <div className="relative mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-700 leading-tight">
                                Discover Amazing
                                <span className="block text-slate-500">Products</span>
                            </h1>
                            <p className="text-lg lg:text-xl mb-8 text-slate-700 leading-relaxed">
                                Shop from thousands of verified sellers and find exactly what you're looking for
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center shadow-lg"
                                >
                                    <FiShoppingBag className="mr-2" />
                                    Shop Now
                                </button>
                                <button
                                    onClick={() => navigate('/about')}
                                    className="border-2 border-gray-400 text-gray-300 px-8 py-3 rounded-lg font-semibold bg-gray-700 hover:border-gray-300 transition-colors"
                                >
                                    Learn More
                                </button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:block"
                        >
                            <div className="rounded-lg shadow-xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80" 
                                    alt="Shopping" 
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ProHelp?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We're committed to providing the best shopping experience
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                            >
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16 bg-slate-800/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Shop by Category</h2>
                        <p className="text-xl text-slate-600">Explore our wide range of product categories</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group cursor-pointer"
                                onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
                            >
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={category.image} 
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                                                <p className="text-sm opacity-90">{category.count}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-gray-600 text-center">{category.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                            <p className="text-xl text-gray-600">Handpicked items just for you</p>
                        </div>
                        <Link 
                            to="/products"
                            className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center"
                        >
                            View All Products <FiArrowRight className="ml-2" />
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 rounded-lg h-48 w-full"></div>
                                    <div className="mt-4 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <BuyerProductCard data={product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-slate-800/10">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">
                        Ready to Start Shopping?
                    </h2>
                    <p className="text-xl text-slate-700 mb-8">
                        Join thousands of satisfied customers and discover amazing products today
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-white text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Start Shopping
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-white text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
