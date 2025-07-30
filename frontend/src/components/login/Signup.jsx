import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from '../../imgLogo/logo.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        userType: "buyer", // Default to 'buyer'
        password: "",
        rePassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.rePassword) {
            setError("Passwords do not match!");
            return;
        }
        if (!formData.userType) {
            setError("Please select an account type (Buyer or Seller).");
            return;
        }

        setLoading(true);
        try {
            const { rePassword, ...postData } = formData;
            const res = await axios.post('http://127.0.0.1:5000/user/signup', postData);
            if (res.status === 200) {
                navigate("/login");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An unknown error occurred during signup.");
        } finally {
            setLoading(false);
        }
    };
    
    const inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow";
    const labelStyle = "block text-sm font-medium text-gray-700 mb-2";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Left Side - Branding */}
                <div className="hidden md:block md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col justify-center items-center text-center">
                    <img src={logo} alt="Company Logo" className="w-24 mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
                    <p className="text-indigo-200">Join our community to start shopping or selling.</p>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                     <div className="md:hidden text-center mb-8">
                         <img src={logo} alt="Company Logo" className="w-16 mx-auto mb-2" />
                         <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="name" className={labelStyle}>Full Name</label>
                                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className={inputStyle} placeholder="John Doe" />
                            </div>
                            <div>
                                <label htmlFor="contact" className={labelStyle}>Contact Number</label>
                                <input id="contact" name="contact" type="tel" required value={formData.contact} onChange={handleChange} className={inputStyle} placeholder="123-456-7890" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className={labelStyle}>Email Address</label>
                            <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className={inputStyle} placeholder="you@example.com" />
                        </div>
                        
                        <div>
                            <label className={labelStyle}>Account Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer flex-1 has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-400">
                                    <input type="radio" name="userType" value="buyer" checked={formData.userType === 'buyer'} onChange={handleChange} className="form-radio h-4 w-4 text-indigo-600"/>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Buyer</span>
                                </label>
                                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer flex-1 has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-400">
                                    <input type="radio" name="userType" value="seller" checked={formData.userType === 'seller'} onChange={handleChange} className="form-radio h-4 w-4 text-indigo-600"/>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Seller</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className={labelStyle}>Password</label>
                            <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className={inputStyle} placeholder="••••••••" />
                        </div>

                        <div>
                            <label htmlFor="rePassword" className={labelStyle}>Confirm Password</label>
                            <input id="rePassword" name="rePassword" type="password" required value={formData.rePassword} onChange={handleChange} className={inputStyle} placeholder="••••••••" />
                        </div>
                        
                        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all">
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </div>
                    </form>
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
