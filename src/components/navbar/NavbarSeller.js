import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import logo from '../../imgLogo/logo.png'
// import myimg from 'https://drive.google.com/file/d/165xZpHbr62BDQHg9WMCbft6S46XYj2FT/view?usp=sharing'
import myimg from '../../imgLogo/self.png'

function NavbarSeller() {
    return (
        
            <div style={{position:'sticky',top:"20px",marginTop:0,zIndex:10}}>
            <StyledWrapper>
                <div className='mainBar'>
                    <div className='logo'>
                        <div><img src={logo} alt="logo" /></div>
                    </div>
                    <div className='options'>
                        <div><Link to={'/'} style={{ textDecoration: 'none' }}>Home</Link></div>
                        <div><Link to={'/add'} style={{ textDecoration: 'none' }}>Add Product</Link></div>
                        <div><Link to={'/update'} style={{ textDecoration: 'none' }}>Update</Link></div>
                        <div><Link to={'/about'} style={{ textDecoration: 'none' }}>About</Link></div>
                    </div>
                    <div className='info'>
                        <div>
                            <img src={myimg} alt="None" />
                        </div>
                    </div>
                </div>
                </StyledWrapper>
            </div>
    )
}

const StyledWrapper = styled.div`

.mainBar{
    border:2px #998c8cd9 solid;
    border-radius: 30px;
    width:80%;
    margin:0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    background-color: floralwhite;
}
.mainBar div{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
}

.logo{

}
.logo img{
    width: 93px; 
    height: 45px; 
    object-fit: cover;
    object-position: 0%; 
}

.options{
    gap : 15px;
    color : #9052e9;
    font-size : 15px;
}

.options div:link ,div:visited {
    padding-bottom : 2px;
    color : #9052e9;
}
.options div Link:visited {
    padding-bottom : 2px;
    color : #9052e9;
}

.options div:hover {
    border-bottom: 2px solid #4f64fd;
    cursor: pointer;
    font-weight:500;
    transition: all 0.2s ease-in-out;
    transform: scale(1.08)
}

.info img{
    width: 30px; 
    height: 30px; 
    object-fit: cover;
    object-position: 0%; 
}

`;

export default NavbarSeller
