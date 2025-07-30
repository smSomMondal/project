import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/userContext.jsx";
import logo from '../../imgLogo/logo.png'; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const userData = { email, password };
            const userRes = await axios.put("/user/login", userData);
            
            if (userRes.status === 200) {
                const user = userRes.data;
                login(user);
                navigate('/');
                window.location.reload(); // Consider removing this for better SPA experience
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
                    <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                    <p className="text-indigo-200">Sign in to continue to your account.</p>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <div className="md:hidden text-center mb-8">
                         <img src={logo} alt="Company Logo" className="w-16 mx-auto mb-2" />
                         <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className={labelStyle}>Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputStyle}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputStyle}
                                placeholder="••••••••"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all"
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </button>
                        </div>
                    </form>
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Not a member?{' '}
                        <Link to="/signup" className="font-medium text-indigo-600 hover:underline">
                            Sign up now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
