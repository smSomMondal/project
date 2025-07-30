import React, { useEffect, useState } from "react";
import axios from "axios";
import BuyerProductCard from "../productCard/BuyerProductCard.jsx";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiAlertCircle, FiSearch, FiX, FiFilter } from 'react-icons/fi';


function ProductListBuyer() {
    const [prods, setProds] = useState([]);
    const [filteredProds, setFilteredProds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Get search params from URL
    const urlParams = new URLSearchParams(location.search);
    const categoryFromUrl = urlParams.get('category');
    const searchFromUrl = urlParams.get('search');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching products...');
            const res = await axios.put("/product/getProductUser");
            //console.log('Product API Response:', res.data);

            if (res.data?.product && Array.isArray(res.data.product)) {
                // Filter out products with invalid data
                const validProducts = res.data.product.filter((product) =>
                    product &&
                    product.name &&
                    typeof product.price !== "undefined" &&
                    product.price !== null
                );

                //console.log("Valid products:", validProducts);
                setProds(validProducts);
            } else {
                console.warn("No products found in response:", res.data);
                setProds([]);
            }
        } catch (err) {
            console.error("Error fetching products:", err.response || err);
            let errorMessage = "Failed to load products. Please try again later.";
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Initialize search and category from URL
    useEffect(() => {
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
        if (searchFromUrl) {
            setSearchTerm(searchFromUrl);
        }
    }, [categoryFromUrl, searchFromUrl]);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on search and category
    useEffect(() => {
        let filtered = [...prods];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        setFilteredProds(filtered);
    }, [prods, searchTerm, selectedCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        updateURL();
    };

    const updateURL = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (selectedCategory) params.set('category', selectedCategory);
        
        const queryString = params.toString();
        const newUrl = queryString ? `/products?${queryString}` : '/products';
        window.history.pushState({}, '', newUrl);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        window.history.pushState({}, '', '/products');
    };

    const categories = [...new Set(prods.map(product => product.category).filter(Boolean))];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white py-6 lg:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <h1 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">Loading Products...</h1>
                        <p className="text-lg sm:text-base text-gray-500">Please wait while we fetch the latest products</p>
                    </div>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white py-6 lg:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h2>
                            <p className="text-red-600">{error}</p>
                        </div>
                        <button
                            onClick={fetchProducts}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const displayProducts = filteredProds.length > 0 ? filteredProds : prods;
    const hasActiveFilters = searchTerm || selectedCategory;

    if (!loading && prods.length === 0) {
        return (
            <div className="min-h-screen bg-white py-6 lg:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-yellow-800 mb-2">No Products Available</h2>
                            <p className="text-yellow-600">Check back later for new products!</p>
                        </div>
                        <button
                            onClick={fetchProducts}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 pt-6 lg:pt-8">
                    <h1 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">Our Products</h1>
                    <p className="text-lg sm:text-base text-gray-500">Find the perfect items for your needs</p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search products, brands, categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setTimeout(updateURL, 100);
                            }}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-flex items-center"
                        >
                            <FiSearch className="mr-2 h-4 w-4" />
                            Search
                        </button>
                    </form>
                    
                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            {searchTerm && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                    Search: "{searchTerm}"
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setTimeout(updateURL, 100);
                                        }}
                                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                                    >
                                        <FiX className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {selectedCategory && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                    Category: {selectedCategory}
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('');
                                            setTimeout(updateURL, 100);
                                        }}
                                        className="ml-2 text-green-600 hover:text-green-800"
                                    >
                                        <FiX className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-500 hover:text-gray-700 underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Summary */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        {hasActiveFilters
                            ? `Showing ${displayProducts.length} of ${prods.length} products`
                            : `Showing ${displayProducts.length} products`
                        }
                        {searchTerm && ` for "${searchTerm}"`}
                        {selectedCategory && ` in ${selectedCategory}`}
                    </p>
                </div>

                {/* No Results Message */}
                {hasActiveFilters && displayProducts.length === 0 && (
                    <div className="text-center py-12">
                        <FiAlertCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-4">
                            No products match your current filters. Try adjusting your search or category selection.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Products Grid */}
                {displayProducts.length > 0 && (
                    <motion.div 
                        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {displayProducts.map((product) => (
                            <motion.div key={product._id} variants={item} className="h-full w-full">
                                <BuyerProductCard data={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default ProductListBuyer;