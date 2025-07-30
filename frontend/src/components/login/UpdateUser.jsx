import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext.jsx";

const UpdateUser = () => {
    const [address, setAddress] = useState({
        state: "",
        district: "",
        city: "",
        pin: "",
        road: "",
        houseNo: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { login, user } = useUser();
    const navigate = useNavigate();

    // Pre-fill form if user data is available
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.address) {
            setAddress(storedUser.address);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const storedData = JSON.parse(localStorage.getItem("user"));
            if (!storedData?.token || !storedData?.email) {
                throw new Error("User not logged in");
            }

            const payload = { email: storedData.email, address };
            const res = await axios.post('http://127.0.0.1:5000/user/updateInfo', payload, {
                headers: { Authorization: `Bearer ${storedData.token}` },
            });

            if (res.status === 200) {
                login(res.data); // Update user context with new data
                setSuccess("Profile updated successfully!");
                setTimeout(() => navigate(-1), 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow";
    const labelStyle = "block text-sm font-medium text-gray-700 mb-2";

    return (
        <main className="bg-gray-50 min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                 <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Update Your Profile</h1>
                <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="border-b border-gray-200 pb-6">
                             <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="houseNo" className={labelStyle}>Apt / House No.</label>
                                    <input id="houseNo" name="houseNo" placeholder="e.g., #123" value={address.houseNo} onChange={handleChange} required className={inputStyle} />
                                </div>
                                <div>
                                    <label htmlFor="road" className={labelStyle}>Street / Road</label>
                                    <input id="road" name="road" placeholder="e.g., Main Street" value={address.road} onChange={handleChange} required className={inputStyle} />
                                </div>
                                 <div>
                                    <label htmlFor="city" className={labelStyle}>City</label>
                                    <input id="city" name="city" placeholder="e.g., New Delhi" value={address.city} onChange={handleChange} required className={inputStyle} />
                                </div>
                                 <div>
                                    <label htmlFor="district" className={labelStyle}>District</label>
                                    <input id="district" name="district" placeholder="e.g., South Delhi" value={address.district} onChange={handleChange} required className={inputStyle} />
                                </div>
                                <div>
                                    <label htmlFor="state" className={labelStyle}>State</label>
                                    <input id="state" name="state" placeholder="e.g., Delhi" value={address.state} onChange={handleChange} required className={inputStyle} />
                                </div>
                                <div>
                                    <label htmlFor="pin" className={labelStyle}>PIN Code</label>
                                    <input id="pin" name="pin" type="text" placeholder="e.g., 110001" value={address.pin} onChange={handleChange} required className={inputStyle} />
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
                        {success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{success}</p>}

                        <div className="pt-4 flex justify-end gap-4">
                             <button type="button" onClick={() => navigate(-1)} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="py-2 px-6 border border-transparent rounded-lg shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default UpdateUser;
