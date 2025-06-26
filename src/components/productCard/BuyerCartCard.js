import React from "react";
import styled from "styled-components";
import { useProduct } from "../../context/productContext";
import logo from "../../imgLogo/logo.png";
import { useNavigate } from "react-router-dom";

function BuyerCartCard({ data }) {
    const { setTarProduct } = useProduct();
    const navegate = useNavigate();

    const handelClick = (e) => {
        setTarProduct(data);
        navegate("/detail");
    };
    const handelDelet = (e) => {
        console.log("hiiiiiiiiiiiiiiii");
    };
    return (
        <StyledWrapper>
            <div className="card">
                <div className="img">
                    <img
                        src={data.imagesUrl || logo}
                        alt="hola"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = logo;
                        }}
                    />
                </div>
                <div className="info">
                    <div>{data.brand}</div>
                    <div>
                        <p>{data.description}</p>
                    </div>
                    <div>$ {data.price}</div>
                    <div>Hot Deal</div>
                </div>
                <div className="buttonGr">
                    <button onClick={handelDelet}>remove from cart</button>
                    <button onClick={handelClick}>detai</button>
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  width: 30%;

  .card {
    border: 2px solid #a2d7d9;
    border-radius: 10px;
    width: 100%;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
  }

  .card .img {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
  }
  .card img {
    width: 80%;
    ${"" /* height:200px;  */}
    object-fit: cover;
    object-position: 0%;
  }
  .card .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
    align-items: flex-start;
    gap: 2px;
  }

  .card .info div:nth-child(1) {
    color: #802ede;
    font-size: large;
    font-weight: 600;
  }
  .card .info div:nth-child(2) {
    width: 100%;
    color: #55727f;
    font-size: small;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${"" /* border: 1px solid gray; */}
  }
  .card .info div:nth-child(3) {
    color: #3f3838;
    font-size: 17px;
    font-weight: 700;
  }
  .card .info div:nth-child(4) {
    color: #1edc26;
    padding-inline: 5px;
    background-color: #c4e1c6c9;
  }

  .card:hover {
    transform: scale(1.08);
    transition: all 0.3s ease-in-out;
    background-color: white;
    transform: translateY(-5px);
  }

  .card:hover::after {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 5px solid;
    border-color: linear-gradient(
      90deg,
      rgba(28, 110, 173, 1) 0%,
      rgba(143, 87, 199, 0.85) 50%,
      rgba(83, 237, 209, 1) 100%
    );
    filter: blur(10px);
    z-index: -1;
    border-radius: 20px;
  }

  .buttonGr {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
  }

  .buttonGr button {
    margin-top: 20px;
    padding: 2px 5px;
    background-color: #4b6bfe;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .buttonGr button:hover {
    background-color: #7c29f4;
    box-shadow: 0px 0px 15px #4b6bfe;
    transform: scale(1.2);
  }
`;

export default BuyerCartCard;
