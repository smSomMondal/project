import React from "react";
import axios from "axios";

function BuyerCartCard({ fun, data }) {
  const { _id, name, brand, price, imagesUrl } = data.productId;

  const removeCart = async () => {
    try {
      const storedData = JSON.parse(localStorage.getItem("user"));
      const token = storedData?.token;
      const res = await axios.post(
        "http://localhost:5000/cart/remove",
        { pId: _id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        fun();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative flex w-80 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative mx-4 mt-4 h-72 overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700">
        <img src={imagesUrl[0]} alt="product-image" className="h-full w-full object-cover" />
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="block font-sans text-base font-medium leading-relaxed text-blue-gray-900 antialiased">
            {name}
          </p>
          <p className="block font-sans text-base font-medium leading-relaxed text-blue-gray-900 antialiased">
            ₹{price}
          </p>
        </div>
        <p className="block font-sans text-sm font-normal leading-normal text-gray-700 antialiased opacity-75">
          {brand}
        </p>
      </div>
      <div className="p-6 pt-0">
        <button
          onClick={removeCart}
          className="block w-full select-none rounded-lg bg-red-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default BuyerCartCard; 