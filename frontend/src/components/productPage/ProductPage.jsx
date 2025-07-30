import React, { useState } from 'react';

const product = {
  name: "Noise Colorfit Icon 2 Smartwatch",
  price: 999,
  originalPrice: 5999,
  discount: 83,
  rating: 4.1,
  reviews: 40745,
  description: "1.8’’ Display with Bluetooth Calling, AI Voice Assistant, Jet Black Strap.",
  offers: [
    "5% Unlimited Cashback on Flipkart Axis Bank Credit Card",
    "10% instant discount on SBI Credit Card Transactions, up to ₹1,250 on orders of ₹4,990 and above",
    "10% instant discount on SBI Credit Card EMI Transactions, up to ₹1,500 on orders of ₹4,990 and above",
    "Get extra 52% off (price inclusive of cashback/coupon)"
  ],
  images: [
    "/images/angle1.jpeg",
    "/images/angle1.jpeg",
    "/images/angle1.jpeg",
    "/images/angles1.jpeg",
  ],
};

const ProductPage = () => {
  const [mainImage, setMainImage] = useState(product.images[0]);

  return (
    <div className="flex p-8 bg-gray-50 min-h-screen">
      <div className="flex-shrink-0 w-1/3">
        <img src={mainImage} alt="Main product" className="w-full rounded-lg shadow-lg" />
        <div className="flex mt-4 space-x-2">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Product angle ${index}`}
              className="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-blue-500"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>

      <div className="ml-8">
        <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
        <p className="text-sm text-gray-600 mt-2">⭐ {product.rating} | {product.reviews.toLocaleString()} Ratings & Reviews</p>
        <div className="flex items-baseline mt-4">
          <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
          <span className="text-lg text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
          <span className="text-lg text-green-600 font-semibold ml-2">({product.discount}% off)</span>
        </div>
        <p className="mt-4 text-gray-700">{product.description}</p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6">Available offers</h3>
        <ul className="mt-2 space-y-2">
          {product.offers.map((offer, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start">
              <span className="text-green-500 mr-2">✅</span> {offer}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75">
            Add to Cart
          </button>
          <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
