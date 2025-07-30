import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext.jsx';
import logo from '../../imgLogo/logo.png';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

function NavbarSeller() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { logOut } = useUser();

    const activeLinkStyle = {
        color: '#4f46e5',
        borderBottom: '2px solid #4f46e5'
    };

    const handleLogout = () => {
        logOut();
        navigate('/login');
        window.location.reload();
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-decoration-none">
                            <h1 className="text-xl lg:text-2xl font-bold text-indigo-600 m-0">ShopNow</h1>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 transition duration-300 pb-1" end>
                            Dashboard
                        </NavLink>
                        <NavLink to="/add" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 transition duration-300 pb-1">
                            Add Product
                        </NavLink>
                        <NavLink to="/update" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 transition duration-300 pb-1">
                            Manage Products
                        </NavLink>
                        <NavLink to="/about" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 transition duration-300 pb-1">
                            About
                        </NavLink>
                    </div>

                    {/* Desktop User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <span className="text-sm font-semibold text-gray-700 bg-indigo-100 px-3 py-1 rounded-full">
                            Seller Mode
                        </span>
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <FiUser className="h-5 w-5" />
                                <span className="text-sm">Account</span>
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <FiUser className="mr-3 h-4 w-4" />
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <FiLogOut className="mr-3 h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
                        <div className="pt-4 space-y-2">
                            <NavLink
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
                                end
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/add"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
                            >
                                Add Product
                            </NavLink>
                            <NavLink
                                to="/update"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
                            >
                                Manage Products
                            </NavLink>
                            <NavLink
                                to="/about"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
                            >
                                About
                            </NavLink>
                            <hr className="my-2" />
                            <Link
                                to="/cart"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                Cart
                            </Link>
                            <Link
                                to="/profile"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
                            >
                                <FiUser className="mr-3 h-4 w-4" />
                                My Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                <FiLogOut className="mr-3 h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default NavbarSeller; 