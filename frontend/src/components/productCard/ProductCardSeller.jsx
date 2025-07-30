import React, { useState } from 'react'
import { useProduct } from '../../context/productContext.jsx'
import logo from '../../imgLogo/logo.png'
import { useNavigate } from 'react-router-dom'
import { FiEdit, FiTrash2, FiEye, FiPackage } from 'react-icons/fi'
import axios from 'axios'

function ProductCardSeller({data, onDelete, onEdit}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const {setTarProduct} = useProduct();
    const navigate = useNavigate();

    const handleView = (e) => {
        e.stopPropagation();
        setTarProduct(data);
        navigate(`/detail/${data._id}`);
    }

    const handleEdit = (e) => {
        e.stopPropagation();
        if (onEdit) onEdit();
    }

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this product?')) {
            setIsDeleting(true);
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const token = user?.token;
                if (!token) throw new Error("Authentication token not found.");

                await axios.post(
                    "http://localhost:5000/product/deleteProduct",
                    { _id: data._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (onDelete) onDelete(); // Refresh product list in parent
            } catch (error) {
                alert("Failed to delete product.");
            }
            setIsDeleting(false);
        }
    }

    const stockStatusClass = data.stock > 0
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";

    const lowStockWarning = data.stock > 0 && data.stock <= 5;

    return (
        <div className="w-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group relative">
            {/* Low Stock Warning */}
            {lowStockWarning && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
                    Low Stock!
                </div>
            )}
            
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button
                    onClick={handleView}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    title="View Details"
                >
                    <FiEye size={14} />
                </button>
                <button
                    onClick={handleEdit}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    title="Edit Product"
                >
                    <FiEdit size={14} />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    title="Delete Product"
                >
                    <FiTrash2 size={14} />
                </button>
            </div>

            <div className="overflow-hidden rounded-t-lg">
                <img
                    src={data?.imagesUrl?.[0] || logo}
                    alt={data.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = logo;
                    }}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate" title={data.name}>
                    {data.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{data.brand}</p>
                
                <div className="flex justify-between items-center mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${stockStatusClass}`}>
                        <FiPackage className="inline mr-1" size={14} />
                        {data.stock > 0 ? `${data.stock} in stock` : "Out of stock"}
                    </span>
                    <span className="font-bold text-lg text-gray-900">
                        ₹{data.price}
                    </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p><strong>Category:</strong> {data.category}</p>
                    <p><strong>Subcategory:</strong> {data.subcategory}</p>
                </div>

                <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Orders:</span>
                        <span className="font-semibold text-indigo-600">
                            {data?.orderList?.length || 0} active
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCardSeller
