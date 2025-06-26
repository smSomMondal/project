import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import ProductCardSeller from "../productCard/ProductCardSeller";

function ProductListSeller() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchProducts = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem('token'));
            const token = storedData?.token;
            setLoading(true);
            const { data } = await axios.put("http://localhost:5000/product/getProduct", {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log(data);

            setProducts(data.product);
            setError(null);
        } catch (err) {
            setError("Failed to fetch products. Please try again later.");
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    return (
        <StyledWrapper>
            <div className="tital">Your Product List</div>
            <div className="item">
                {
                    products.map((item) => (<ProductCardSeller data={item} />))
                }
            </div>
        </StyledWrapper>
    );
}

export default ProductListSeller;

const StyledWrapper = styled.div`
  padding-top: 30px;
  padding-inline: 7%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  gap:40px;

.tital{
    font-size: 55px;
    font-style: oblique;
    font-weight: 600;
    color: #4b6bfe;
}

.item{
    height: 100%;
    width: 90%;
    display: flex;
    flex-direction: row;
    align-content: flex-start;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 30px;
    row-gap: 30px;
}

`;
