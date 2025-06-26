import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../../imgLogo/logo.png'; // Replace with actual product image
import { useProduct } from '../../context/productContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductDetails() {

  const [isFlipped, setIsFlipped] = useState(false);
  const { tarProduct } = useProduct()
  const navigate = useNavigate()
  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handelBuy = async (e) => {
    e.preventDefault();
    try {
      const storedData = JSON.parse(localStorage.getItem("user"));
      const token = storedData?.token;
      const res = await axios.post(
        "http://localhost:5000/cart/add",
        {
          userId: 1,
          productId: tarProduct._id,
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
        navigate(`/order/${res.data.cart._id}`)
      }
      if (res.status === 201) {
        //console.log(res);
        navigate(`/order/${res.data.cart._id}`)
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const addToCart = async (e) => {
    e.preventDefault()
    try {
      const storedData = JSON.parse(localStorage.getItem("user"));
      const token = storedData?.token;
      const res = await axios.post(
        "http://localhost:5000/cart/add",
        {
          userId: 1,
          productId: tarProduct._id,
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
        navigate('/cart')
      }
      if (res.status === 201) {
        alert("already exits");
        //console.log(res);
        navigate('/cart')
      }
    } catch (error) {
      navigate('/login')
      console.log(error);
    }
  };

  return (
    <Container>
      <FlipCard>
        <FlipCardInner $isFlipped={isFlipped}>
          <FlipCardFront>
            <ImageGridWrapper>
              <div className="big">
                <img src={tarProduct?.imagesUrl || logo} alt="hola"
                  onError={(e) => { e.target.onerror = null; e.target.src = logo; }} />
              </div>
              <div className="small1">
                <img src={tarProduct?.imagesUrl || logo} alt="smal1"
                  onError={(e) => { e.target.onerror = null; e.target.src = logo; }} />
              </div>
              <div className="small2">
                <img src={tarProduct?.imagesUrl || logo} alt="small2"
                  onError={(e) => { e.target.onerror = null; e.target.src = logo; }} />
              </div>
            </ImageGridWrapper>
            <h3 onClick={handleFlip}>View Detailes</h3>
          </FlipCardFront>
          <FlipCardBack onMouseLeave={handleFlip}>
            <div className='info'>
              <div>
                <div>Name</div>
                <div>{tarProduct.name}</div>
              </div>
              <div>
                <div>Description</div>
                <div>{tarProduct.name}</div>
              </div>
              <div>
                <div>Catagori</div>
                <div>{tarProduct.category}</div>
              </div>
              <div>
                <div>brand</div>
                <div>{tarProduct.brand}</div>
              </div>
              <div>
                <div>Prise</div>
                <div>{tarProduct.price}</div>
              </div>
            </div>
            <div className='action'>
              <button onClick={addToCart}>Add to Cart</button>
              <button onClick={handelBuy}>order</button>
            </div>
          </FlipCardBack>
        </FlipCardInner>
      </FlipCard>
    </Container>
  );
}

export default ProductDetails;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const FlipCard = styled.div`
  background-color: transparent;
  width: 65%;
  height: 80%;
  perspective: 1000px;
`;

const FlipCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;

  transform: ${({ $isFlipped }) => ($isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
`;

const FlipCardFront = styled.div`
  position: absolute;
  width: 98%;
  height: 98%;
  backface-visibility: hidden;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;

  ${'' /* img {
    width: 100%;
    height: 60%;
    object-fit: cover;
    border-radius: 8px;
  } */}

  h3 {
    margin-top: 15px;
    font-size: 1.2rem;
    color: #333;
  }
`;

const FlipCardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: #f8f8f8;
  color: black;
  transform: rotateY(180deg);
  border-radius: 10px;
  padding: 20px;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;

  .info{
    width:75%;
    height: 50%;
    display:flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    justify-content: space-between;
  }

  .info div{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap:3%
  }

  .info div div:nth-child(1){
    width: 30%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
  }
  .info div div:nth-child(2){
    width: 75%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }

  .action{
    height: 20%;
    width: 60%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
  }

  .action button{
    width:30%;
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #4b6bfe;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .action button:hover {
    background-color: #7c29f4;
    box-shadow: 0px 0px 15px #4b6bfe;
    transform: scale(1.2);
  }
    
`;
const ImageGridWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  width: 100%;
  height: 90%;
  border: 2px solid #ddd;
  padding: 10px;

  .big {
    grid-row: span 2;
  }

  img {
    width: 85%;
    height: 85%;
    object-fit: cover;
    border-radius: 8px;
  }
`;
