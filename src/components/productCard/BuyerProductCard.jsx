import React from 'react'
import styled from 'styled-components'
import { useProduct } from '../../context/productContext'
import logo from '../../imgLogo/logo.png'
import { useNavigate } from 'react-router-dom'

function BuyerProductCard({data}) {

    const {setTarProduct}=useProduct()
    const navegate=useNavigate()

    const handelClick = (e)=>{
        setTarProduct(data)
        navegate('/detail')
    }
  return (
    <StyledWrapper>
      <div className="card" onClick={handelClick}>
        <div className="img">
            <img src={data?.imagesUrl || logo} alt="hola"
            onError={(e) => { e.target.onerror = null; e.target.src = logo; }} />
        </div>
        <div className="info">
            <div>{data.brand}</div>
            <div><p>{data.description}</p></div>
            <div>$ {data.price}</div>
            <div>Hot Deal</div>
        </div>
    </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
width:30%;
.card{
    border:2px solid #a2d7d9;
    border-radius:10px;
    width:100%;
    padding:5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
}

.card .img{
    width:100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
}
.card img{
    width: 80%; 
    object-fit: cover;
    object-position: 0%; 
}
.card .info{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
    align-items: flex-start;
    gap: 2px;
    width:100%;
    overflow:hidden;
}

.card .info div:nth-child(1){
    color: #802ede;
    font-size: large;
    font-weight: 600;
}
.card .info div:nth-child(2) p{
    width:240px;
    color: #55727f;
    font-size: small;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${'' /* border: 1px solid gray; */}
}
.card .info div:nth-child(3){
    color: #3f3838;
    font-size: 17px;
    font-weight: 700;

}
.card .info div:nth-child(4){
    color: #1edc26;
    padding-inline: 5px;
    background-color: #c4e1c6c9;
}

.card:hover{
    transform: scale(1.08);
    transition: all 0.3s ease-in-out;
    background-color:white;
}

.card:hover::after {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border:5px solid ;
  border-color:#00BCD4;
  filter: blur(10px);
  z-index: -1;
  border-radius: 20px;
}

`
export default BuyerProductCard
