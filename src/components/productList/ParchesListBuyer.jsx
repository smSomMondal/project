import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PurchesCard from '../productCard/PurchesCard'

function ParchesListBuyer() {

    const [cartData, setCartData] = useState([])
    const fetchData = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;
            const res = await axios.post(
                "http://localhost:5000/cart/list",
                {
                    userId: 1,
                    quantity: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                //console.log(res);
                setCartData(res.data.cart)
                //navigate('/order/:id')
            }
            if (res.status === 201) {
                //console.log(res);
                //navigate(`/order/${res.data.cart._id}`)
                alert("already exits");

            }
            //console.log(cartData);            
        } catch (error) {
            //console.log(error);
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <>
            <div
            style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                width: "80%",
                 gap: "50px", 
            }}
        >
            {cartData.filter((item)=>item.stage==='APPROVED').length > 0 ? (<>
                {cartData.filter((item)=>item.stage==='APPROVED').map((cart) => (
                    <PurchesCard data={cart}/>                 
                ))}
            </>) : (<div>no cart present</div>)}
        </div>
        </>
    )
}

export default ParchesListBuyer
