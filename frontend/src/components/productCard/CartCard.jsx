import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="w-[300px] h-[200px] perspective-1000 group">
      <div className="w-full h-full relative transform-style-3d transition-transform duration-1000 group-hover:rotate-y-180">
        <div className="absolute w-full h-full backface-hidden bg-[#6A2C70] text-white flex flex-col items-center border-10 border-[#6A2C70] rounded-lg justify-center text-2xl rotate-y-0">
          <p>Front Side</p>
          <p>{data.product.name}</p>
          <p>{data.product.brand}</p>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-[#F08A5D] text-white flex items-center border-10 border-[#F08A5D] rounded-lg justify-center text-2xl rotate-y-180">
          <p>Back Side</p>
          <button onClick={() => navigate(`/order/${data._id}`)}>order</button>
        </div>
      </div>
    </div>
  );
};

export default CartCard; 