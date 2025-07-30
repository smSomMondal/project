import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext.jsx';
import { FiUser, FiMail, FiPhone, FiEdit, FiLogOut, FiShoppingBag, FiShield } from 'react-icons/fi';

const Profile = () => {
    const navigate = useNavigate();
    const { logOut } = useUser();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(storedUser);
        setEditedUser({
            name: storedUser.name || '',
            email: storedUser.email || '',
            contact: storedUser.contact || ''
        });
    }, [navigate]);

    const handleLogout = () => {
        logOut();
        navigate('/');
        window.location.reload();
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Here you would typically update the user via API
        const updatedUser = { ...user, ...editedUser };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = 'Profile updated successfully!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    const handleCancel = () => {
        setEditedUser({
            name: user.name || '',
            email: user.email || '',
            contact: user.contact || ''
        });
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <FiUser className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="ml-4">
                                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                                    <p className="text-sm text-gray-600 capitalize">
                                        {user.userType} Account
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <FiLogOut className="mr-2 h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                                    {!isEditing && (
                                        <button
                                            onClick={handleEdit}
                                            className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                        >
                                            <FiEdit className="mr-2 h-4 w-4" />
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedUser.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <div className="flex items-center">
                                            <FiUser className="h-5 w-5 text-gray-400 mr-3" />
                                            <span className="text-gray-900">{user.name}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editedUser.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <div className="flex items-center">
                                            <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                                            <span className="text-gray-900">{user.email}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="contact"
                                            value={editedUser.contact}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <div className="flex items-center">
                                            <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                                            <span className="text-gray-900">{user.contact}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Account Type
                                    </label>
                                    <div className="flex items-center">
                                        <FiShield className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-gray-900 capitalize">{user.userType}</span>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {user.userType === 'buyer' ? (
                                    <>
                                        <button
                                            onClick={() => navigate('/orders')}
                                            className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <FiShoppingBag className="h-5 w-5 mr-3" />
                                            View Order History
                                        </button>
                                        <button
                                            onClick={() => navigate('/cart')}
                                            className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <FiShoppingBag className="h-5 w-5 mr-3" />
                                            View Shopping Cart
                                        </button>
                                        {/* <button
                                            onClick={() => navigate('/cart')}
                                            className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <FiShoppingBag className="h-5 w-5 mr-3" />
                                            View Delivered Products
                                        </button> */}
                                        <button
                                            onClick={() => navigate('/products')}
                                            className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <FiShoppingBag className="h-5 w-5 mr-3" />
                                            Continue Shopping
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => navigate('/add')}
                                            className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <FiShoppingBag className="h-5 w-5 mr-3" />
                                            Add New Product
                                        </button>
                                        <button
                                            onClick={() => navigate('/update')}
                                            className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <FiEdit className="h-5 w-5 mr-3" />
                                            Manage Products
                                        </button>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <FiShoppingBag className="h-5 w-5 mr-3" />
                                            View Dashboard
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Account Security */}
                        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Account Security</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-600 mb-4">
                                    Keep your account secure by updating your password regularly.
                                </p>
                                <button
                                    onClick={() => {
                                        // Navigate to change password or implement modal
                                        alert('Password change functionality would be implemented here');
                                    }}
                                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
