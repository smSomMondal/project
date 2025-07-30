import React from 'react';
import { FiShield, FiTruck, FiHeart, FiUsers, FiAward, FiPhoneCall } from 'react-icons/fi';
import logo from '../../imgLogo/logo.png';

function About() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-slate-800/10 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl text-slate-700 font-bold sm:text-5xl lg:text-6xl">About ProHelp</h1>
                    <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto">
                        Your trusted e-commerce platform connecting buyers and sellers worldwide. 
                        We're building the future of online shopping with innovation, security, and customer satisfaction at our core.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Mission</h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                            To create a seamless, secure, and enjoyable shopping experience that empowers both buyers and sellers to thrive in the digital marketplace.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiAward className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                            <p className="text-gray-600">
                                Every product on our platform is verified for quality and authenticity. We work only with trusted sellers.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiShield className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
                            <p className="text-gray-600">
                                Advanced encryption and secure payment gateways ensure your financial information is always protected.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiTruck className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">
                                Partner with leading logistics companies to ensure quick and reliable delivery to your doorstep.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiUsers className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community First</h3>
                            <p className="text-gray-600">
                                Building a supportive community where buyers and sellers can connect, share, and grow together.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiPhoneCall className="h-8 w-8 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
                            <p className="text-gray-600">
                                Our dedicated customer support team is available round the clock to assist you with any queries.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiHeart className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Love</h3>
                            <p className="text-gray-600">
                                We prioritize customer satisfaction above everything else. Your happiness is our success.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-slate-800/10 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 text-salte-700 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold ">10,000+</div>
                            <div className=" mt-2">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold ">500+</div>
                            <div className=" mt-2">Trusted Sellers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold ">25,000+</div>
                            <div className="0 mt-2">Products Available</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold ">99.9%</div>
                            <div className=" mt-2">Uptime Guarantee</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Support</h3>
                            <p className="text-gray-600">support@prohelp.com</p>
                            <p className="text-gray-600">+91 xxxxxxxxx</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Inquiries</h3>
                            <p className="text-gray-600">business@prohelp.com</p>
                            <p className="text-gray-600">+91 xxxxxxxxx</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Press & Media</h3>
                            <p className="text-gray-600">press@prohelp.com</p>
                            <p className="text-gray-600">+91 xxxxxxxxx</p>
                        </div>
                    </div>
                    <div className="mt-12">
                        <p className="text-gray-600">
                            Join thousands of satisfied customers and experience the future of online shopping today!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;