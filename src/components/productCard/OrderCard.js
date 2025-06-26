import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const OrderCard = () => {
    const { id } = useParams();
    const navi = useNavigate();
    const [numProduct, setNumProduct] = useState();
    const [numProductB, setNumProductB] = useState(0);
    const [costOnePis, setCostOnePis] = useState(0);
    // const [userInfo,setUserInfo]=useState({});
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const fetchData = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/info",
                {
                    cartId: id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                // console.log(res);
                // console.log(userInfo);
                setNumProductB(res.data.cart.items.quantity);
                setCostOnePis(res.data.cart.items.priceAtTime)
            }
        } catch (error) {
            //console.log(error);
        }
    }

    const updateCard = async (e) => {
        e.preventDefault();
        try {
            if (!window.confirm("Are you sure you want to update this product quantity?")) {
                return;
            }
            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/update",
                {
                    cartId: id,
                    quantity: numProduct
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                // console.log(res);
                setNumProductB(res.data.cart.items.quantity)
                alert("update sucessfull")
            }
        } catch (error) {
            //console.log(error);
        }
    }
    const orderCart = async (e) => {
        e.preventDefault();
        // const answer = prompt("want to order? if not cancel !!!");
        if(!userInfo.address){
            navi('/updateAddress')
        }
        if (!window.confirm("Are you sure you want to order this product?")) {
            return;
        }
        try {

            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/order",
                {
                    orderItem: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                // console.log(res);
                alert("order sucessfull")
                navi('/cart')
            }
        } catch (error) {
            //console.log(error);
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <StyledWrapper>
            <div className="container">
                <div className="card cart">
                    <label className="title">CHECKOUT</label>
                    <div className="steps">
                        <div className="step">
                            <div>
                                <span>SHIPPING</span>
                                <p>{userInfo.address.houseNo}, {userInfo.address.road}</p>
                                <p>{userInfo.address.pin}, {userInfo.address.city},{userInfo.address.state}</p>
                                <p style={{ display: 'flex', gap: "5px" }}>Want to update Address? <span style={{ display: 'inline', fontSize: 11 }} onClick={(e) => navi('/updateAddress')}>Click</span></p>
                            </div>
                            <hr />
                            <div>
                                <span>INFO</span>
                                <p>QUNNTITY {numProductB}</p>
                                <p>{userInfo.address.city},{userInfo.address.district},{userInfo.address.state}</p>
                            </div>
                            <hr />
                            <div>
                                <span>PAYMENT METHOD</span>
                                <p>cash on delivery</p>
                                <p>Delevary into 7 days</p>
                            </div>
                            <hr />
                            <div className="promo">
                                <span>WANT TO UPDATE QUANTITY?</span>
                                <form className="form" onSubmit={updateCard}>
                                    <input type='number' placeholder="Enter a Promo Code" className="input_field" value={numProduct} onChange={(e) => setNumProduct(e.target.value)} />
                                    <button>Apply</button>
                                </form>
                            </div>
                            <hr />
                            <div className="promo">
                                <span>HAVE A PROMO CODE?</span>
                                <form className="form">
                                    <input type="text" placeholder="Enter a Promo Code" className="input_field" />
                                    <button>Apply</button>
                                </form>
                            </div>
                            <hr />
                            <div className="payments">
                                <span>PAYMENT</span>
                                <div className="details">
                                    <span>Total:</span>
                                    <span>${numProduct*costOnePis}</span>
                                    <span>one Quntity:</span>
                                    <span>${costOnePis}</span>
                                    <span>Tax:</span>
                                    <span>$00.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card checkout">
                    <div className="footer">
                        <label className="price">${numProductB * costOnePis}</label>
                        <button className="checkout-btn" onClick={orderCart}>Checkout</button>
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  /* Body */
  padding-top:15px;
  display:flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  .container {
    display: grid;
    grid-template-columns: auto;
    gap: 0px;
  }

  hr {
    height: 1px;
    background-color: rgba(16, 86, 82, .75);
    ;
    border: none;
  }

  .card {
    width: 400px;
    background: rgb(247 242 231);
    box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
  }

  .title {
    width: 100%;
    height: 40px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid rgba(16, 86, 82, .75);
    font-weight: 700;
    font-size: 11px;
    color: #000000;
  }

  /* Cart */
  .cart {
    border-radius: 19px 19px 0px 0px;
  }

  .cart .steps {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  .cart .steps .step {
    display: grid;
    gap: 10px;
  }

  .cart .steps .step span {
    font-size: 13px;
    font-weight: 600;
    color: #000000;
    margin-bottom: 8px;
    display: block;
  }

  .cart .steps .step p {
    font-size: 11px;
    font-weight: 600;
    color: #000000;
  }

  /* Promo */
  .promo form {
    display: grid;
    grid-template-columns: 1fr 80px;
    gap: 10px;
    padding: 0px;
  }

  .input_field {
    width: auto;
    height: 36px;
    padding: 0 0 0 12px;
    border-radius: 5px;
    outline: none;
    border: 1px solid  rgb(16, 86, 82);
    background-color: rgb(251, 243, 228);
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
  }

  .input_field:focus {
    border: 1px solid transparent;
    box-shadow: 0px 0px 0px 2px rgb(251, 243, 228);
    background-color: rgb(201, 193, 178);
  }

  .promo form button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 18px;
    gap: 10px;
    width: 100%;
    height: 36px;
    background: rgb(238 221 185 / 90%);
    box-shadow: 0px 0.5px 0.5px #F3D2C9, 0px 1px 0.5px rgba(239, 239, 239, 0.5);
    border-radius: 5px;
    border: 0;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    color: #000000;
  }

  /* Checkout */
  .payments .details {
    display: grid;
    grid-template-columns: 10fr 1fr;
    padding: 0px;
    gap: 5px;
  }

  .payments .details span:nth-child(odd) {
    font-size: 12px;
    font-weight: 600;
    color: #000000;
    margin: auto auto auto 0;
  }

  .payments .details span:nth-child(even) {
    font-size: 13px;
    font-weight: 600;
    color: #000000;
    margin: auto 0 auto auto;
  }

  .checkout .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px 10px 20px;
    background-color: rgba(235, 185, 58, 0.5);
  }

  .price {
    position: relative;
    font-size: 22px;
    color:rgb(47, 46, 43);
    font-weight: 900;
  }

  .checkout .checkout-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 36px;
    background: rgba(16, 86, 82, .55);
    box-shadow: 0px 0.5px 0.5px rgba(16, 86, 82, .75), 0px 1px 0.5px rgba(16, 86, 82, .75);
    ;
    border-radius: 7px;
    border: 1px solid rgb(16, 86, 82);
    ;
    color: #000000;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
  }`;

export default OrderCard;
