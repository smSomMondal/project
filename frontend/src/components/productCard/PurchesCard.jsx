import React from 'react';
import { useProduct } from '../../context/productContext';
import logo from '../../imgLogo/logo.png';
import { useNavigate } from 'react-router-dom';

function PurchesCard({ data }) {
  const { setTarProduct } = useProduct();
  const navigate = useNavigate();

  const handleClick = () => {
    setTarProduct(data.product);
    navigate('/detail');
  };

  return (
    <div className="w-[30%] relative group">
      <div className="border-2 border-[#a2d7d9] rounded-lg w-full p-1.5 flex flex-col items-start justify-between gap-2.5 transition-all duration-300 ease-in-out bg-white hover:scale-105 hover:-translate-y-1">
        <div className="w-full flex flex-col items-center justify-center">
          <img
            src={data.product?.imagesUrl || logo}
            alt="hola"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = logo;
            }}
            className="w-4/5 object-cover"
          />
        </div>
        <div className="w-full flex flex-col flex-wrap content-start justify-center items-start gap-0.5">
          <div className="text-[#802ede] text-lg font-semibold">{data.product.brand}</div>
          <div className="w-full text-[#55727f] text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            <p>{data.product.description}</p>
          </div>
          <div className="text-[#3f3838] text-[17px] font-bold">$ {data.totalPrice}</div>
          <div className="text-[#1edc26] px-1.5 bg-[#c4e1c6c9]">Hot Deal</div>
        </div>
        <div className="w-full flex flex-row justify-around items-center">
          <button
            onClick={handleClick}
            className="mt-5 px-2 py-0.5 bg-[#4b6bfe] text-white border-none rounded-md cursor-pointer transition-transform duration-300 hover:bg-[#7c29f4] hover:shadow-[0px_0px_15px_#4b6bfe] hover:scale-125"
          >
            detail
          </button>
        </div>
      </div>
      <div
        className="absolute -top-2.5 -left-2.5 -right-2.5 -bottom-2.5 rounded-2xl border-4 filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          borderColor: 'linear-gradient(90deg, rgba(28, 110, 173, 1) 0%, rgba(143, 87, 199, 0.85) 50%, rgba(83, 237, 209, 1) 100%)',
        }}
      />
    </div>
  );
}

export default PurchesCard;
