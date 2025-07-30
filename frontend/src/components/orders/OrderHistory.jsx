import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [delevers, setDelevers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the token from localStorage
      const storedData = JSON.parse(localStorage.getItem("user"));
      if (!storedData?.token) {
        setError('You need to log in to view your orders');
        setLoading(false);
        return;
      }

      const token = storedData.token;

      console.log('Fetching orders with token:', token);

      // Use the full URL like other API calls
      const { data } = await axios.post(
        "/cart/list", {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Order response data:', data);

      /*// Check if data is an array directly or nested in an object
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (data && typeof data === 'object') {
        // Try to find any array property that might contain the orders
        const possibleOrdersArray = Object.values(data).find(val => Array.isArray(val));
        if (possibleOrdersArray) {
          setOrders(possibleOrdersArray);
        } else {
          console.warn('Unexpected orders response format:', data);
          setOrders([]);
        }
      } else {
        console.warn('Unexpected orders response format:', data);
        setOrders([]);
      }*/
      setOrders(data.cart.filter(items => items.stage === "ORDERED"));
      setDelevers(data.cart.filter(items => items.stage === "APPROVED"));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error.response || error);
      setError(error.response?.data?.message || 'Failed to load your orders. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingWrapper>Loading your orders...</LoadingWrapper>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (orders.length === 0) {
    return (
      <Container>
        <h1>Order History</h1>
        <EmptyState>
          <p>You don't have any orders yet.</p>
          <StyledLink to="/products">Continue Shopping</StyledLink>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container className='lg:mx-auto'>
      <h1>Order History</h1>
      <OrdersGrid>
        {orders.map(order => (
          <OrderCard key={order._id}>
            <OrderHeader>
              <OrderId>Order #{order._id.slice(-6)}</OrderId>
              <OrderStatus status={order.stage}>{order.stage}</OrderStatus>
            </OrderHeader>
            <OrderDetails>
              <ProductsList>
                {/* {order.products && order.products.map(item => (
                  <ProductItem key={item.product?._id || item._id}>
                    <span>{item.product?.name || 'Product'}</span>
                    <span>x{item.quantity}</span>
                    <span>${item.price?.toFixed(2) || '0.00'}</span>
                  </ProductItem>
                ))} */}
                <ProductItem>
                  <span>{order.product?.name || 'Product'}</span>
                  <span>x{order.items.quantity}</span>
                  <span>${order.items.priceAtTime?.toFixed(2) || '0.00'}</span>
                </ProductItem>
              </ProductsList>
              <OrderInfo>
                <InfoItem>
                  <span>Order Date:</span>
                  <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                </InfoItem>
                <InfoItem>
                  <span>Total Amount:</span>
                  <span>₹{order.totalPrice?.toFixed(2) || '0.00'}</span>
                </InfoItem>
                <InfoItem>
                  <span>Payment Method:</span>
                  <span>Cash on Delevery</span>
                </InfoItem>
                {order.shippingAddress && (
                  <ShippingAddress>
                    <h4>Shipping Address</h4>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </ShippingAddress>
                )}
              </OrderInfo>
            </OrderDetails>
          </OrderCard>
        ))}
      </OrdersGrid>
      {
        delevers.length > 0 ? (
          <>
          <br/>
          <br/>
            <h1>Delevered History</h1>
            <OrdersGrid>
              {delevers.map(order => (
                <OrderCard key={order._id}>
                  <OrderHeader>
                    <OrderId>Order #{order._id.slice(-6)}</OrderId>
                    <OrderStatus status={order.stage}>{order.stage}</OrderStatus>
                  </OrderHeader>
                  <OrderDetails>
                    <ProductsList>
                      {/* {order.products && order.products.map(item => (
                  <ProductItem key={item.product?._id || item._id}>
                    <span>{item.product?.name || 'Product'}</span>
                    <span>x{item.quantity}</span>
                    <span>${item.price?.toFixed(2) || '0.00'}</span>
                  </ProductItem>
                ))} */}
                      <ProductItem>
                        <span>{order.product?.name || 'Product'}</span>
                        <span>x{order.items.quantity}</span>
                        <span>${order.items.priceAtTime?.toFixed(2) || '0.00'}</span>
                      </ProductItem>
                    </ProductsList>
                    <OrderInfo>
                      <InfoItem>
                        <span>Order Date:</span>
                        <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                      </InfoItem>
                      <InfoItem>
                        <span>Total Amount:</span>
                        <span>₹{order.totalPrice?.toFixed(2) || '0.00'}</span>
                      </InfoItem>
                      <InfoItem>
                        <span>Payment Method:</span>
                        <span>Cash on Delevery</span>
                      </InfoItem>
                      {order.shippingAddress && (
                        <ShippingAddress>
                          <h4>Shipping Address</h4>
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                          <p>{order.shippingAddress.country}</p>
                        </ShippingAddress>
                      )}
                    </OrderInfo>
                  </OrderDetails>
                </OrderCard>
              ))}
            </OrdersGrid>
          </>
        ) : (<></>)
      }
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  // margin: 0 auto;
  padding: 2rem;

  h1 {
    color: #2d3748;
    margin-bottom: 2rem;
  }
`;

const OrdersGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const OrderId = styled.span`
  font-weight: 600;
  color: #2d3748;
`;

const OrderStatus = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;

  ${props => {
    switch (props.status) {
      case 'pending':
        return 'background-color: #fff3cd; color: #856404;';
      case 'approved':
        return 'background-color: #d4edda; color: #155724;';
      case 'ORDERED':
        return 'background-color: #cce5ff; color: #004085;';
      case 'shipped':
        return 'background-color: #e2e3e5; color: #383d41;';
      case 'APPROVED':
        return 'background-color: #d1e7dd; color: #0f5132;';
      case 'rejected':
        return 'background-color: #f8d7da; color: #721c24;';
      default:
        return 'background-color: #f8f9fa; color: #343a40;';
    }
  }}
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  padding: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductsList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ProductItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    
    span:first-child {
      grid-column: 1 / -1;
      margin-bottom: 0.5rem;
    }
  }
`;

const OrderInfo = styled.div`
  border-left: 1px solid #e2e8f0;
  padding-left: 1rem;
  
  @media (max-width: 768px) {
    border-left: none;
    border-top: 1px solid #e2e8f0;
    padding-left: 0;
    padding-top: 1rem;
    margin-top: 1rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  span:first-child {
    color: #718096;
  }

  span:last-child {
    font-weight: 500;
  }
`;

const ShippingAddress = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;

  h4 {
    color: #4a5568;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.25rem 0;
    color: #718096;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #2d3748;
`;

const ErrorMessage = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  
  p {
    font-size: 1.1rem;
    color: #718096;
    margin-bottom: 1.5rem;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  background-color: #3182ce;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: #2b6cb0;
  }
`;

export default OrderHistory;
