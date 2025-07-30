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
        <div className="flex flex-row flex-wrap justify-center items-center w-4/5 gap-12">
            {cartData.filter((item) => item.stage === 'APPROVED').length > 0 ? (
                cartData.filter((item) => item.stage === 'APPROVED').map((cart) => (
                    <PurchesCard key={cart._id} data={cart} />
                ))
            ) : (
                <div>no cart present</div>
            )}
        </div>
    )
}

export default ParchesListBuyer
