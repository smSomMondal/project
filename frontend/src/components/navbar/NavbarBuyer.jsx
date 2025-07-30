import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiPackage, FiSearch } from 'react-icons/fi';

function NavbarBuyer() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto">
                <nav className="px-4 sm:px-6 lg:px-8 py-2">
                    {/* Top navigation bar */}
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/home" className="text-decoration-none">
                                <h1 className="text-xl lg:text-2xl font-bold text-indigo-600 m-0">ShopNow</h1>
                            </Link>
                        </div>

                        {/* Desktop Nav Items */}
                        <div className="hidden md:flex items-center space-x-6">
                            <NavLink 
                                to="/home" 
                                className={({ isActive }) => 
                                    `${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'} 
                                    font-medium transition-colors duration-200 pb-1`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink 
                                to="/products" 
                                className={({ isActive }) => 
                                    `${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'} 
                                    font-medium transition-colors duration-200 pb-1`
                                }
                            >
                                Products
                            </NavLink>
                            <NavLink 
                                to="/orders" 
                                className={({ isActive }) => 
                                    `${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'} 
                                    font-medium transition-colors duration-200 pb-1`
                                }
                            >
                                My Orders
                            </NavLink>
                            <NavLink 
                                to="/about" 
                                className={({ isActive }) => 
                                    `${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'} 
                                    font-medium transition-colors duration-200 pb-1`
                                }
                            >
                                About
                            </NavLink>
                        </div>
                        
                        {/* Desktop Search Bar */}
                        <div className="hidden md:block flex-grow mx-6 max-w-md">
                            <form onSubmit={handleSearch} className="flex w-full">
                                <input
                                    type="text"
                                    placeholder="Search products, brands..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <FiSearch size={16} />
                                </button>
                            </form>
                        </div>

                        {/* Cart and Profile Icons - Only visible on desktop */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link 
                                to="/cart" 
                                className="flex flex-col items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors duration-200 p-1"
                            >
                                <FiShoppingCart size={20} />
                                <span className="text-xs font-medium">Cart</span>
                            </Link>
                            <Link 
                                to="/profile" 
                                className="flex flex-col items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors duration-200 p-1"
                            >
                                <FiUser size={20} />
                                <span className="text-xs font-medium">Profile</span>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button 
                            className="md:hidden ml-3 p-2 rounded-lg hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMenuOpen && (
                        <div className="md:hidden mt-1 pt-1 border-t border-gray-200">
                            <NavLink 
                                to="/home" 
                                onClick={() => setIsMenuOpen(false)} 
                                className="block py-1 text-gray-700 hover:text-indigo-600"
                            >
                                Home
                            </NavLink>
                            <NavLink 
                                to="/products" 
                                onClick={() => setIsMenuOpen(false)} 
                                className="block py-1 text-gray-700 hover:text-indigo-600"
                            >
                                Products
                            </NavLink>
                            <NavLink 
                                to="/orders" 
                                onClick={() => setIsMenuOpen(false)} 
                                className="block py-1 text-gray-700 hover:text-indigo-600"
                            >
                                My Orders
                            </NavLink>
                            <NavLink 
                                to="/about" 
                                onClick={() => setIsMenuOpen(false)} 
                                className="block py-1 text-gray-700 hover:text-indigo-600"
                            >
                                About
                            </NavLink>
                            <hr className="my-2 border-gray-200" />
                            <NavLink 
                                to="/cart" 
                                onClick={() => setIsMenuOpen(false)} 
                                className="flex items-center py-1 text-gray-700 hover:text-indigo-600"
                            >
                                <FiShoppingCart size={18} className="mr-2" />
                                Cart
                            </NavLink>
                            <NavLink 
                                to="/profile" 
                                onClick={() => setIsMenuOpen(false)} 
                                className="flex items-center py-1 text-gray-700 hover:text-indigo-600"
                            >
                                <FiUser size={18} className="mr-2" />
                                Profile
                            </NavLink>
                        </div>
                    )}
                </nav>
                
                {/* Mobile Search Bar */}
                <div className="block md:hidden px-4 pb-1">
                    <form onSubmit={handleSearch} className="flex">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="px-3 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors"
                        >
                            <FiSearch size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}


export default NavbarBuyer;