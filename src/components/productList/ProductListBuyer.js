import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import BuyerProductCard from "../productCard/BuyerProductCard";

function ProductListBuyer() {
    const [prods, setProds] = useState([]);

    useEffect(() => {
        axios
            .put("http://localhost:5000/product/getProductUser")
            .then((res) => {
                //console.log(res);
                setProds(res.data.product);
            })
            .catch((err) => console.error("Error fetching products:", err));
    }, []);
    return (
        <StyledWrapper>
            <div className="main">
                {prods.map((product) => (
                    <BuyerProductCard data={product} />
                ))}
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  width: 100%;
  .main {
    width:100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    gap: 20px;
    row-gap: 30px;
    padding: 20px 40px 20px 40px;
  }
`;
export default ProductListBuyer;
