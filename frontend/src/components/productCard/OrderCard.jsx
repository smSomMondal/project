import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const OrderCard = () => {
    const { id } = useParams();
    const navi = useNavigate();
    const [numProduct, setNumProduct] = useState('');
    const [numProductB, setNumProductB] = useState(0);
    const [costOnePis, setCostOnePis] = useState(0);
    const userInfo = JSON.parse(localStorage.getItem("user"));

    const fetchData = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/info",
                { cartId: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                setNumProductB(res.data.cart.items.quantity);
                setCostOnePis(res.data.cart.items.priceAtTime);
            }
        } catch (error) {
            // console.log(error);
        }
    };

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
                { cartId: id, quantity: numProduct },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                setNumProductB(res.data.cart.items.quantity);
                alert("update sucessfull");
            }
        } catch (error) {
            // console.log(error);
        }
    };

    const orderCart = async (e) => {
        e.preventDefault();
        if (!userInfo.address) {
            navi('/updateAddress');
        }
        if (!window.confirm("Are you sure you want to order this product?")) {
            return;
        }
        try {
            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/order",
                { orderItem: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                alert("order sucessfull");
                navi('/cart');
            }
        } catch (error) {
            // console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="pt-4 flex flex-row justify-center items-center">
            <div className="grid grid-cols-1 gap-0">
                <div className="w-[400px] bg-[#f7f2e7] shadow-lg rounded-t-2xl">
                    <label className="w-full h-10 relative flex items-center pl-5 border-b border-[rgba(16,86,82,0.75)] font-bold text-xs text-black">
                        CHECKOUT
                    </label>
                    <div className="flex flex-col p-5">
                        <div className="grid gap-2.5">
                            <div>
                                <span className="text-sm font-semibold text-black mb-2 block">SHIPPING</span>
                                <p className="text-xs font-semibold text-black">{userInfo.address.houseNo}, {userInfo.address.road}</p>
                                <p className="text-xs font-semibold text-black">{userInfo.address.pin}, {userInfo.address.city},{userInfo.address.state}</p>
                                <p className="flex gap-1.5 text-xs font-semibold text-black">Want to update Address? <span className="inline text-[11px] cursor-pointer" onClick={() => navi('/updateAddress')}>Click</span></p>
                            </div>
                            <hr className="h-px bg-[rgba(16,86,82,0.75)] border-none" />
                            <div>
                                <span className="text-sm font-semibold text-black mb-2 block">INFO</span>
                                <p className="text-xs font-semibold text-black">QUNNTITY {numProductB}</p>
                                <p className="text-xs font-semibold text-black">{userInfo.address.city},{userInfo.address.district},{userInfo.address.state}</p>
                            </div>
                            <hr className="h-px bg-[rgba(16,86,82,0.75)] border-none" />
                            <div>
                                <span className="text-sm font-semibold text-black mb-2 block">PAYMENT METHOD</span>
                                <p className="text-xs font-semibold text-black">cash on delivery</p>
                                <p className="text-xs font-semibold text-black">Delevary into 7 days</p>
                            </div>
                            <hr className="h-px bg-[rgba(16,86,82,0.75)] border-none" />
                            <div>
                                <span className="text-sm font-semibold text-black mb-2 block">WANT TO UPDATE QUANTITY?</span>
                                <form className="grid grid-cols-[1fr_80px] gap-2.5" onSubmit={updateCard}>
                                    <input type='number' placeholder="Enter a Promo Code" className="h-9 pl-3 rounded-md outline-none border border-[#105652] bg-[#fbf3e4] transition-all duration-300 focus:border-transparent focus:shadow-[0px_0px_0px_2px_#fbf3e4] focus:bg-[#c9c1b2]" value={numProduct} onChange={(e) => setNumProduct(e.target.value)} />
                                    <button className="flex justify-center items-center px-4 h-9 bg-[rgba(238,221,185,0.9)] shadow-[0px_0.5px_0.5px_#F3D2C9,0px_1px_0.5px_rgba(239,239,239,0.5)] rounded-md border-0 font-semibold text-xs text-black">Apply</button>
                                </form>
                            </div>
                            <hr className="h-px bg-[rgba(16,86,82,0.75)] border-none" />
                            <div>
                                <span className="text-sm font-semibold text-black mb-2 block">HAVE A PROMO CODE?</span>
                                <form className="grid grid-cols-[1fr_80px] gap-2.5">
                                    <input type="text" placeholder="Enter a Promo Code" className="h-9 pl-3 rounded-md outline-none border border-[#105652] bg-[#fbf3e4] transition-all duration-300 focus:border-transparent focus:shadow-[0px_0px_0px_2px_#fbf3e4] focus:bg-[#c9c1b2]" />
                                    <button className="flex justify-center items-center px-4 h-9 bg-[rgba(238,221,185,0.9)] shadow-[0px_0.5px_0.5px_#F3D2C9,0px_1px_0.5px_rgba(239,239,239,0.5)] rounded-md border-0 font-semibold text-xs text-black">Apply</button>
                                </form>
                            </div>
                            <hr className="h-px bg-[rgba(16,86,82,0.75)] border-none" />
                            <div>
                                <span className="text-sm font-semibold text-black mb-2 block">PAYMENT</span>
                                <div className="grid grid-cols-[10fr_1fr] gap-1.5">
                                    <span className="text-xs font-semibold text-black my-auto mr-auto">Total:</span>
                                    <span className="text-sm font-semibold text-black my-auto ml-auto">${numProduct*costOnePis}</span>
                                    <span className="text-xs font-semibold text-black my-auto mr-auto">one Quntity:</span>
                                    <span className="text-sm font-semibold text-black my-auto ml-auto">${costOnePis}</span>
                                    <span className="text-xs font-semibold text-black my-auto mr-auto">Tax:</span>
                                    <span className="text-sm font-semibold text-black my-auto ml-auto">$00.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[400px] bg-[#f7f2e7] shadow-lg">
                    <div className="flex items-center justify-between p-2.5 bg-[rgba(235,185,58,0.5)]">
                        <label className="relative text-2xl text-[#2f2e2b] font-black">${numProductB * costOnePis}</label>
                        <button className="flex justify-center items-center w-[150px] h-9 bg-[rgba(16,86,82,0.55)] shadow-[0px_0.5px_0.5px_rgba(16,86,82,0.75),0px_1px_0.5px_rgba(16,86,82,0.75)] rounded-lg border border-[#105652] text-black text-sm font-semibold transition-all duration-300" onClick={orderCart}>Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard; 