import React, { useEffect, useState } from "react";
import axios from "axios";
import BuyerProductCard from "./productCard/BuyerProductCard";
import styled from "styled-components";
import { theme } from "../styles/theme";
import { motion } from "framer-motion";

function ProductList() {
  // const [products, setProducts] = useState([]);
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
        setProds(res.data.product);
        setFiltered(res.data.product); // Initialize filtered products
      })
      .catch((err) => console.error("Error fetching products:",));
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
    prods,
  ]);

  useEffect(() => {
    setAvailability("");
  }, [category]);

  const dropdownStyle =
    "px-3 py-2.5 text-base border border-gray-300 rounded-md bg-white min-w-[150px]";

  return (
    <Container>
      <Header>
        <Title>🛍️ Product List</Title>
        <Subtitle>Discover our curated collection of premium products</Subtitle>
      </Header>

      <input
        type="text"
        placeholder="Search by name or brand..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3.5 py-2.5 w-full max-w-lg border border-gray-300 rounded-md text-base mb-5"
      />

      <div className="flex justify-center flex-wrap gap-3 mb-8">
        <select
          onChange={(e) => setCategory(e.target.value)}
          className={dropdownStyle}
        >
          <option value="">All Categories</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setAvailability(e.target.value)}
          className={dropdownStyle}
          disabled={!category}
        >
          <option value="">All Subcategories</option>
          {category &&
            categories[category].map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
        </select>

        <select
          onChange={(e) => setRating(Number(e.target.value))}
          className={dropdownStyle}
        >
          <option value="0">All Ratings</option>
          <option value="4">4⭐ & up</option>
          <option value="3">3⭐ & up</option>
          <option value="2">2⭐ & up</option>
        </select>

        <select
          onChange={(e) => setSortOption(e.target.value)}
          className={dropdownStyle}
        >
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="ratingHighLow">Rating: High to Low</option>
        </select>
      </div>

      <Grid>
        {filtered.length ? (
          filtered.map((product, index) => (
            <GridItem
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <BuyerProductCard data={product} />
            </GridItem>
          ))
        ) : (
          <p className="text-lg text-gray-500">No products found.</p>
        )}
      </Grid>
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing["2xl"]};
`;

const Title = styled.h1`
  font-size: ${theme.typography.sizes["3xl"]};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.lightText};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${theme.spacing.xl};

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${theme.breakpoints.xl}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const GridItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

export default ProductList;