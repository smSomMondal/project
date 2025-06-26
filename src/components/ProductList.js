import React, { useEffect, useState } from "react";
import axios from "axios";
import BuyerProductCard from "./productCard/BuyerProductCard";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [rating, setRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [sortOption, setSortOption] = useState("");

  const categories = {
    Clothing: ["Men Clothing", "Women Clothing", "Kids Clothing"],
    Footwear: ["Men Footwear", "Women Footwear", "Kids Footwear"],
    Electronics: [
      "Mobiles & Tablets",
      "Laptops & Computers",
      "TV & Home Entertainment",
    ],
    "Home & Kitchen": ["Kitchen Appliances", "Home Decor", "Furniture"],
    "Beauty & Personal Care": ["Makeup", "Skincare", "Haircare"],
    "Sports & Fitness": ["Fitness Equipment", "Sportswear"],
    "Baby Products": ["Diapers", "Baby Toys"],
    "Grocery & Essentials": ["Snacks", "Staples"],
    "Gaming & Entertainment": ["Video Games", "Gaming Accessories"],
    "Books & Stationery": ["Fiction", "Stationery"],
    Automotive: ["Car Accessories", "Bike Accessories"],
  };

  const [prods, setProds] = useState([]);

  useEffect(() => {
    axios
      .put("http://localhost:5000/product/getProductUser")
      .then((res) => {
        console.log(res);
        setProds(res.data.product);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    let result = [...prods];

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== "") {
      result = result.filter((p) => p.category === category);
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (rating > 0) {
      result = result.filter((p) => p.rating >= rating);
    }

    /*if (availability === "In Stock") {
      result = result.filter(p => p.inStock === true);
    } else if (availability === "Out of Stock") {
      result = result.filter(p => p.inStock === false);
    }*/
    if (availability !== "") {
      result = result.filter((p) => p.subcategory === availability);
    }

    if (sortOption === "priceLowHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighLow") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "ratingHighLow") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFiltered(result);
  }, [
    searchTerm,
    category,
    priceRange,
    rating,
    availability,
    sortOption,
    products,
  ]);

  useEffect(() => {
    setAvailability("");
  }, [category]);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        backgroundColor: "#f9f9f9",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Segoe UI', sans-serif",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "28px", marginBottom: "25px", color: "#333" }}>
        🛍️ Product List
      </h2>

      {/* Search and Filter */}
      <input
        type="text"
        placeholder="Search by name or brand..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px 14px",
          width: "100%",
          maxWidth: "500px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "30px",
        }}
      >
        <select
          onChange={(e) => setCategory(e.target.value)}
          style={dropdownStyle}
        >
          <option value="">all Category</option>
          {Object.keys(categories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setAvailability(e.target.value)}
          style={dropdownStyle}
        >
          <option value="">all Subcategory</option>
          {category &&
            categories[category].map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
        </select>

        <select
          onChange={(e) => setRating(Number(e.target.value))}
          style={dropdownStyle}
        >
          <option value="0">All Ratings</option>
          <option value="4">4⭐ & up</option>
          <option value="3">3⭐ & up</option>
          <option value="2">2⭐ & up</option>
        </select>

        <select
          onChange={(e) => setSortOption(e.target.value)}
          style={dropdownStyle}
        >
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="ratingHighLow">Rating: High to Low</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {filtered.length ? (
          filtered.map((product) => <BuyerProductCard data={product} />)
        ) : (
          <p style={{ fontSize: "18px", color: "#888" }}>No products found.</p>
        )}
      </div>
    </div>
  );
}

const dropdownStyle = {
  padding: "10px 12px",
  fontSize: "15px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  backgroundColor: "#fff",
  minWidth: "150px",
};

const addToCartBtnStyle = {
  marginTop: "10px",
  padding: "10px",
  width: "100%",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const wishlistBtnStyle = {
  marginTop: "5px",
  padding: "8px",
  width: "100%",
  backgroundColor: "#ffc107",
  color: "#000",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default ProductList;
