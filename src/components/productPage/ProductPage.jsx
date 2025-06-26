import React, { useState } from 'react';
import '../index.css';

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
    <div className="product-container">
      <div className="product-image-section">
        <img src={mainImage} alt="Main product" className="product-main-image" />
        <div className="product-thumbnails">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Product angle ${index}`}
              className="product-thumbnail"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>

      <div className="product-details">
        <h2>{product.name}</h2>
        <p>⭐ {product.rating} | {product.reviews.toLocaleString()} Ratings & Reviews</p>
        <div className="price-section">
          <span className="current-price">₹{product.price}</span>
          <span className="original-price">₹{product.originalPrice}</span>
          <span className="discount">({product.discount}% off)</span>
        </div>
        <p>{product.description}</p>

        <h3>Available offers</h3>
        <ul className="offers-list">
          {product.offers.map((offer, index) => (
            <li key={index}>
              ✅ {offer}
            </li>
          ))}
        </ul>

        <div className="buttons">
          <button>Add to Cart</button>
          <button>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
