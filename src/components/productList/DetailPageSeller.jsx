import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import logo from '../../imgLogo/logo.png'

function DetailPageSeller() {
    const { id } = useParams();

    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem("token"));
            const token = storedData?.token;
            const { data } = await axios.put(
                "http://localhost:5000/product/getProductInfo",
                {
                    pId: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            //console.log(data);

            setProducts(data.product);
        } catch (err) {
            //console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    return (
        <>
            <StyleWrapper>
                <div className="product">
                    <div className="tital">
                        <h2>Product Info</h2>
                    </div>

                    {products.length > 0 && (
                        <div className="detail">
                            <div className="img">
                                <img src={products[0].imagesUrl || logo} alt="img" />
                            </div>
                            <div className="info">
                                <p>
                                    <strong>Name:</strong> {products[0].name}
                                </p>
                                <p>
                                    <strong>Description:</strong> {products[0].description}
                                </p>
                                <p>
                                    <strong>Price:</strong> ₹{products[0].price}
                                </p>
                                <p>
                                    <strong>Category:</strong> {products[0].category}
                                </p>
                                <p>
                                    <strong>Brand:</strong> {products[0].brand}
                                </p>
                                <p>
                                    <strong>Stock:</strong> {products[0].stock}
                                </p>
                            </div>

                        </div>
                    )}
                </div>
                <div className="orderList">
                    {products.length > 0 && <Card data={products[0].orderList} />}
                </div>
            </StyleWrapper>
        </>
    );
}

const OrderList = ({ data }) => {
    const handelAccept = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem("token"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/approveSeler",
                {
                    cartId: data._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            //console.log(res);
            if (res.status === 200) {
                window.location.reload();
            }
        } catch (err) {
            //console.error("Error fetching products:", err);
        }
    };
    const handelCancel = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem("token"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/cancelSeler",
                {
                    cartId: data._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(res);
            if (res.status === 200) {
                window.location.reload();
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };
    return (
        <>
            <StyleWrapperOL>
                <div className="whole">
                    <div className="ProDetail">
                        <div>
                            <div>Quantity</div>
                            <div>{data.items.quantity}</div>
                        </div>
                        <div>
                            <div>Total Price</div>
                            <div>{data.totalPrice}</div>
                        </div>
                        <div>
                            <div>Stage</div>
                            <div>{data.stage}</div>
                        </div>
                        <div>
                            <div>Price that time</div>
                            <div>{data.items.priceAtTime}</div>
                        </div>
                    </div>
                    <div className="butGrop">
                        <button onClick={handelAccept}>accept</button>
                        <button onClick={handelCancel}>cancel</button>
                    </div>
                </div>
            </StyleWrapperOL>
        </>
    );
};

const Card = ({ data }) => {
    return (
        <StyledWrapper1>
            <div className="cards">
                {data.map((item) => (
                    <div className="card red">
                        <OrderList key={item._id} data={item} />
                    </div>
                ))}
            </div>
        </StyledWrapper1>
    );
};

const StyledWrapper1 = styled.div`
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  align-content: center;
  flex-wrap: wrap;
  overflow: auto;
  scrollbar-width: none;
  .cards {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    align-items: center;
  }

  .cards .red {
    background-color: #7233f8;
  }

  .cards .blue {
    background-color: #3b82f6;
  }

  .cards .green {
    background-color: #22c55e;
  }

  .cards .card {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    height: fit-content;
    width: 95%;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: 400ms;
  }

  .cards .card p.tip {
    font-size: 1em;
    font-weight: 700;
  }

  .cards .card p.second-text {
    font-size: 0.7em;
  }

  .cards .card:hover {
    transform: scale(1.05, 1.05);
  }

  .cards:hover > .card:not(:hover) {
    filter: blur(10px);
    transform: scale(0.9, 0.9);
  }
`;

export default DetailPageSeller;

const StyleWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 30px;
  padding-inline: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  align-content: flex-start;

  .product {
    width: 40%;
    height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap:30px;
  }
  .product .tital{
    font-size:1.5rem;
  }

  .orderList {
    width: 50%;
    height: 90%;
    padding-top: 25px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    justify-content: flex-start;
  }

.product .detail{
   display: flex;
    height: 80%;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}
.product .detail .img{
    width: 50%;
    display: flex;
    flex-direction: column;
}
.product .detail .info{
width: 90%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    font-size: 1.3rem;
}

`;

const StyleWrapperOL = styled.div`
  padding: 10px;
  width: 90%;

.whole{
    width:100%;
    display:flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
        gap: 5px;
}
.ProDetail{
    width:100%;
    display:flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    justify-content: center;
        gap: 2px;
}
.ProDetail div{
    width:100%;
    display:flex;
    gap:2rem
}
.ProDetail div div:n-child(1){
    width:30%
}
.ProDetail div div:n-child(2){
    width:60%
}
.butGrop{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
}
.butGrop button{
        height: 2rem;
    width: 5rem;
    border-radius: 10px;
    border-color: antiquewhite;
    background-color: beige;
}


.butGrop button:hover{
    transform: scale(1.1, 1.1);
}
`;
