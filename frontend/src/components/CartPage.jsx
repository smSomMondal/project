import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../context/userContext';
import { theme } from '../styles/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiShieldOff, FiTruck } from 'react-icons/fi';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkoutStep, setCheckoutStep] = useState(0); // 0: cart, 1: shipping, 2: payment
    const [isProcessing, setIsProcessing] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        road: '',
        city: '',
        state: '',
        pin: '',
        district: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [cartInfo, setCartInfo] = useState([])
    const navigate = useNavigate();
    const { login } = useUser();

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            setIsProcessing(true);
            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;

            const res = await axios.post(
                "/cart/update",
                {
                    cartId: itemId,
                    quantity: newQuantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                // console.log(res);
                alert("update sucessfull")
            }

            setCartItems(cartItems.map(item =>
                item._id === itemId ? {
                    ...item, items: {
                        ...item.items,
                        quantity: newQuantity
                    }
                } : item
            ));
        } catch (err) {
            //console.error('Error updating quantity:', err);
            setError('Failed to update quantity. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handelSelect = (e) => {
        //console.log("here", e);
        setCartInfo(e)
    }

    const removeItem = async (itemId) => {
        try {
            setIsProcessing(true);
            const storedData = JSON.parse(localStorage.getItem("user"));
            const token = storedData?.token;

            await axios.delete(
                `http://localhost:5000/cart/remove/${itemId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCartItems(cartItems.filter(item => item._id !== itemId));
        } catch (err) {
            //console.error('Error removing item:', err);
            setError('Failed to remove item. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchCartItems = useCallback(async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem("user"));
            if (!storedData?.token) {
                navigate('/login');
                return;
            }
            const token = storedData?.token;
            setLoading(true);
            setError(null);
            // console.log(token);

            const res = await axios.post(
                "/cart/list", {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            // console.log('API Response:', res);
            setCartItems(res.data.cart.filter(items => items.stage === "CREATED"))
            setCartInfo(res.data.cart[0])
            /*if (res.data?.cart && Array.isArray(res.data.cart)) {
                const filteredItems = res.data.cart.filter(item => {
                    // Check if item and product exist
                    if (!item || !item.product) {
                        console.warn('Invalid cart item:', item);
                        return false;
                    }
                    
                    // Check if it's in CREATED stage
                    if (item.stage !== 'CREATED') {
                        return false;
                    }

                    // Check if product has required fields
                    if (!item.product.name || typeof item.product.price === 'undefined') {
                        console.warn('Invalid product data:', item.product);
                        return false;
                    }

                    return true;
                });
                
                // console.log('Filtered Items:', filteredItems);
                setCartItems(filteredItems);
            } else {
                console.warn('Invalid cart data received:', res.data);
                setCartItems([]);
            }*/

            /*if (storedData.address) {
                Object.entries(storedData.address).forEach(([key, value]) => {
                    setShippingAddress({ ...shippingAddress, [key]: value })
                });
            }*/
            if (storedData.address) {
                const updatedShipping = {
                    ...shippingAddress,
                    ...storedData.address
                };
                setShippingAddress(updatedShipping);
            }

        } catch (err) {
            //console.error('Cart fetch error:', err.response || err);
            setError(err.response?.data?.message || "Could not fetch cart items. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCheckout = async () => {
        try {
            if (!shippingAddress.road || !shippingAddress.city || !shippingAddress.state ||
                !shippingAddress.pin || !shippingAddress.district) {
                setError("Please fill in all shipping address fields.");
                return;
            }

            setIsProcessing(true);
            setError(null);

            const storedData = JSON.parse(localStorage.getItem("user"));
            if (!storedData?.token) {
                navigate('/login');
                return;
            }

            const userData = {
                email: JSON.parse(localStorage.getItem("user")).email,
                address: shippingAddress
            };
            const userRes = await axios.post('/user/updateInfo', userData, {
                headers: {
                    Authorization: `Bearer ${storedData.token}`,
                    'Content-Type': 'application/json',
                }
            })
            //console.log(userRes);

            if (userRes.status === 200) {
                const user = userRes.data;
                // console.log(user);
                login(user)
            } else {
                alert("some thing wrong login and try")
            }

            // console.log('Processing checkout with shipping address:', shippingAddress);
            // console.log('Payment method:', paymentMethod);

            const token = storedData.token;
            const response = await axios.post(
                "/cart/order",
                {
                    orderItem: cartInfo._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                // console.log(res);
                alert("order sucessfull")
            }

            // console.log('Checkout response:', response.data);

            if (response.status === 201 || response.status === 200) {
                // Show success message briefly before redirecting
                setError(null);
                setTimeout(() => {
                    navigate('/orders');
                }, 1000);
            } else {
                throw new Error('Checkout failed');
            }
        } catch (err) {
            //console.error('Checkout error:', err.response || err);
            setError(err.response?.data?.message || "Checkout failed. Please try again.");
            setCheckoutStep(1); // Go back to shipping step if there's an error
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    // Helper function to safely parse price
    const parsePrice = (price) => {
        const num = Number(price);
        return isNaN(num) ? 0 : num;
    };

    const validCartItems = cartItems.filter(item => {
        try {
            return (
                item &&
                item.product &&
                item.product.name &&
                (typeof item.product.price === 'number' || !isNaN(Number(item.product.price)))
            );
        } catch (err) {
            //console.warn('Invalid cart item:', item, err);
            return false;
        }
    });

    //console.log('Cart Items:', cartItems);
    //console.log('Valid Cart Items:', validCartItems);
    const subtotal = validCartItems.reduce((sum, item) => sum + parsePrice(item.product.price) * item.quantity, 0);
    const shippingEstimate = 49; // Example shipping cost
    const total = subtotal + shippingEstimate;

    const renderCheckoutSteps = () => {
        switch (checkoutStep) {
            case 1:
                return (
                    <CheckoutForm>
                        <h3>Shipping Address</h3>
                        <FormGroup>
                            <label>road</label>
                            <input
                                type="text"
                                value={shippingAddress.road}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, road: e.target.value })}
                                required
                            />
                        </FormGroup>
                        <FormRow>
                            <FormGroup>
                                <label>City</label>
                                <input
                                    type="text"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>State</label>
                                <input
                                    type="text"
                                    value={shippingAddress.state}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                    required
                                />
                            </FormGroup>
                        </FormRow>
                        <FormRow>
                            <FormGroup>
                                <label>Zip Code</label>
                                <input
                                    type="text"
                                    value={shippingAddress.pin}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, pin: e.target.value })}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>District</label>
                                <input
                                    type="text"
                                    value={shippingAddress.district}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                                    required
                                />
                            </FormGroup>
                        </FormRow>
                        <ButtonGroup>
                            <Button secondary onClick={() => setCheckoutStep(0)}>Back to Cart</Button>
                            <Button onClick={() => setCheckoutStep(2)}>Continue to Payment</Button>
                        </ButtonGroup>
                    </CheckoutForm>
                );
            case 2:
                return (
                    <CheckoutForm>
                        <h3>Payment Method</h3>
                        <PaymentOptions>
                            <PaymentOption>
                                <input
                                    type="radio"
                                    id="credit_card"
                                    name="payment"
                                    value="credit_card"
                                    checked={paymentMethod === 'credit_card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="credit_card">Credit Card</label>
                            </PaymentOption>
                            <PaymentOption>
                                <input
                                    type="radio"
                                    id="paypal"
                                    name="payment"
                                    value="paypal"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="paypal">PayPal</label>
                            </PaymentOption>
                            <PaymentOption>
                                <input
                                    type="radio"
                                    id="cash_on_delivery"
                                    name="payment"
                                    value="cash_on_delivery"
                                    checked={paymentMethod === 'cash_on_delivery'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="cash_on_delivery">Cash on Delivery</label>
                            </PaymentOption>
                        </PaymentOptions>
                        <ButtonGroup>
                            <Button secondary onClick={() => setCheckoutStep(1)}>Back to Shipping</Button>
                            <Button onClick={handleCheckout} disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : 'Place Order'}
                            </Button>
                        </ButtonGroup>
                    </CheckoutForm>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <LoadingWrapper>
                <Spinner />
                <p>Loading your cart...</p>
            </LoadingWrapper>
        );
    }

    if (error && cartItems.length === 0) {
        return (
            <ErrorMessage>
                <p>{error}</p>
                <RetryButton onClick={fetchCartItems}>Retry</RetryButton>
            </ErrorMessage>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <EmptyCart>
                    <div className="icon-wrapper items-center  justify-center flex">
                        <FiShoppingBag size={64} />
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to your cart and they will appear here</p>
                    <ShopNowButton to="/products">
                        Continue Shopping
                    </ShopNowButton>
                </EmptyCart>
            </div>
        );
    }

    return (
        <PageContainer>
            <Container>
                <Header>
                    <Title className='font-bold'>Shopping Cart</Title>
                    <Subtitle>{cartItems.length} items in your cart</Subtitle>
                </Header>

                {error && (
                    <ErrorMessage>
                        <p>{error}</p>
                        <RetryButton onClick={fetchCartItems}>Retry</RetryButton>
                    </ErrorMessage>
                )}

                {loading ? (
                    <LoadingWrapper>
                        <Spinner />
                        <p>Loading your cart...</p>
                    </LoadingWrapper>
                ) : cartItems.length === 0 ? (
                    <EmptyCart>
                        <div className="icon-wrapper">
                            <FiShoppingBag size={64} />
                        </div>
                        <h3>Your cart is empty</h3>
                        <p>Add some items to your cart and they will appear here</p>
                        <ShopNowButton to="/products">
                            Continue Shopping
                        </ShopNowButton>
                    </EmptyCart>
                ) : checkoutStep > 0 ? (
                    renderCheckoutSteps()
                ) : (
                    <CartLayout>
                        <CartItemsList>
                            <CartHeader>
                                <HeaderItem>Product</HeaderItem>
                                <HeaderItem>Price</HeaderItem>
                                <HeaderItem>Quantity</HeaderItem>
                                <HeaderItem>Total</HeaderItem>
                            </CartHeader>
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <CartItemCard
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        onClick={(e) => handelSelect(item)}
                                    >
                                        <ProductCell>
                                            {/* <ItemImage 
                                                src={item.product.imagesUrl?.[0] || item.product.image || 'https://via.placeholder.com/100'} 
                                                alt={item.product.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/100';
                                                }}
                                            /> */}
                                            <ProductDetails>
                                                <ItemName>{item.product.name}</ItemName>
                                                <ItemBrand>{item.product.brand || 'No Brand'}</ItemBrand>
                                                <MobileItemMeta>
                                                    <MobileItemPrice>₹{parsePrice(item.product.price).toFixed(2)}</MobileItemPrice>
                                                </MobileItemMeta>
                                            </ProductDetails>
                                        </ProductCell>
                                        <PriceCell>₹{parsePrice(item.product.price).toFixed(2)}</PriceCell>
                                        <MobileItemRow>
                                            <QuantityCell>
                                                <QuantityControl>
                                                    <QuantityButton
                                                        onClick={() => updateQuantity(item._id, item.items.quantity - 1)}
                                                        disabled={isProcessing || item.quantity <= 1}
                                                    >
                                                        <FiMinus />
                                                    </QuantityButton>
                                                    <QuantityDisplay>{item.items.quantity}</QuantityDisplay>
                                                    <QuantityButton
                                                        onClick={() => updateQuantity(item._id, item.items.quantity + 1)}
                                                        disabled={isProcessing}
                                                    >
                                                        <FiPlus />
                                                    </QuantityButton>
                                                </QuantityControl>
                                            </QuantityCell>
                                        </MobileItemRow>
                                        <TotalCell>
                                            <ItemSubtotal>
                                                ₹{(parsePrice(item.product.price) * item.items.quantity).toFixed(2)}
                                            </ItemSubtotal>
                                            <RemoveButton
                                                onClick={() => removeItem(item._id)}
                                                disabled={isProcessing}
                                            >
                                                <FiTrash2 />
                                            </RemoveButton>
                                        </TotalCell>
                                    </CartItemCard>
                                ))}
                            </AnimatePresence>
                        </CartItemsList>

                        <aside>
                            <OrderSummary>
                                <SummaryTitle>Order Summary</SummaryTitle>
                                <SummaryItem>
                                    <span>Product Name</span>
                                    <span>{(cartInfo.product.name)}</span>
                                </SummaryItem>
                                <SummaryItem>
                                    <span>Subtotal ({cartInfo.items.quantity} items)</span>
                                    <span>₹{(parsePrice(cartInfo.product.price) * cartInfo.items.quantity).toFixed(2)}</span>
                                </SummaryItem>
                                <SummaryItem>
                                    <span>Shipping</span>
                                    <span>₹{shippingEstimate.toFixed(2)}</span>
                                </SummaryItem>
                                <SummaryTotal>
                                    <span>Total</span>
                                    <span>₹{((parsePrice(cartInfo.product.price) * cartInfo.items.quantity) + shippingEstimate).toFixed(2)}</span>
                                </SummaryTotal>
                                <CheckoutButton
                                    onClick={() => setCheckoutStep(1)}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                                </CheckoutButton>
                            </OrderSummary>

                            <BenefitsSection>
                                <Benefit>
                                    <FiTruck />
                                    <span>Free shipping on orders over ₹999</span>
                                </Benefit>
                                <Benefit>
                                    <FiShieldOff />
                                    <span>Secure checkout process</span>
                                </Benefit>
                            </BenefitsSection>
                        </aside>
                    </CartLayout>
                )}
            </Container>
        </PageContainer>
    );
}

const PageContainer = styled.div`
    min-height: 100vh;
    background-color: ${theme.colors.background};
    padding: ${theme.spacing.lg} 0;
    
    @media (max-width: ${theme.breakpoints.sm}) {
        padding: ${theme.spacing.sm} 0;
        overflow-x: hidden; /* Prevent horizontal scrolling */
    }
`;

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: ${theme.spacing.xl};
    
    @media (max-width: ${theme.breakpoints.sm}) {
        padding: ${theme.spacing.md} ${theme.spacing.xs};
        width: 100%;
    }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: ${theme.spacing['2xl']};
    
    @media (max-width: ${theme.breakpoints.sm}) {
        margin-bottom: ${theme.spacing.lg};
    }
`;

const Title = styled.h1`
    font-size: ${theme.typography.sizes['3xl']};
    color: ${theme.colors.text};
    margin-bottom: ${theme.spacing.xs};
    
    @media (max-width: ${theme.breakpoints.sm}) {
        font-size: ${theme.typography.sizes['2xl']};
    }
`;

const Subtitle = styled.p`
    font-size: ${theme.typography.sizes.lg};
    color: ${theme.colors.lightText};
`;

const CartLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: ${theme.spacing.xl};

    @media (max-width: ${theme.breakpoints.lg}) {
        grid-template-columns: 1fr; /* Stack main content and summary on smaller screens */
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        gap: ${theme.spacing.md};
    }
`;

const CartItemsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
    width: 100%;
    
    @media (max-width: ${theme.breakpoints.md}) {
        gap: ${theme.spacing.sm};
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        padding: 0;
    }
`;

const CartItemCard = styled(motion.div)`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    align-items: center;
    gap: ${theme.spacing.lg};
    padding: ${theme.spacing.lg};
    background: ${theme.colors.cardBg};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.sm};
    border: 1px solid ${theme.colors.border};

    @media (max-width: ${theme.breakpoints.lg} and min-width: ${theme.breakpoints.md}) {
        grid-template-columns: 3fr 1fr 1fr 1fr;
        gap: ${theme.spacing.md};
    }
    
    @media (max-width: ${theme.breakpoints.md}) {
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.md};
        padding: ${theme.spacing.md};
        width: 100%;
        align-items: flex-start;
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        padding: ${theme.spacing.sm} ${theme.spacing.md};
    }
`;

const ItemImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: ${theme.borderRadius.md};
    
    @media (max-width: ${theme.breakpoints.sm}) {
        width: 60px;
        height: 60px;
    }
`;

const ProductCell = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};

    @media (max-width: ${theme.breakpoints.md}) {
        flex-wrap: nowrap;
        width: 100%;
        border-bottom: 1px solid ${theme.colors.border};
        padding-bottom: ${theme.spacing.md};
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        align-items: flex-start;
        padding-bottom: ${theme.spacing.sm};
    }
`;

const ProductDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xs};
    flex: 1;
    
    @media (max-width: ${theme.breakpoints.md}) {
        width: calc(100% - 80px); /* Adjust for image width */
        padding-right: ${theme.spacing.sm};
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        width: calc(100% - 60px); /* Adjust for smaller image width */
    }
`;

const ItemName = styled.h3`
    font-size: ${theme.typography.sizes.lg};
    color: ${theme.colors.text};
    margin: 0;
`;

const ItemBrand = styled.span`
    font-size: ${theme.typography.sizes.sm};
    color: ${theme.colors.lightText};
`;

const MobileItemMeta = styled.div`
    display: none;
    
    @media (max-width: ${theme.breakpoints.md}) {
        display: flex;
        flex-direction: column;
        margin-top: ${theme.spacing.xs};
        font-size: ${theme.typography.sizes.sm};
    }
`;

const MobileItemPrice = styled.span`
    color: ${theme.colors.primary};
    font-weight: 600;
    display: none;
    
    @media (max-width: ${theme.breakpoints.md}) {
        display: block;
        margin-top: ${theme.spacing.xs};
    }
`;

const PriceCell = styled.div`
    font-size: ${theme.typography.sizes.lg};
    font-weight: 600;
    color: ${theme.colors.text};
    text-align: center;

    @media (max-width: ${theme.breakpoints.md}) {
        display: none; /* Hide on mobile since we show it in MobileItemMeta */
    }
`;

const QuantityCell = styled.div`
    display: flex;
    justify-content: center;

    @media (max-width: ${theme.breakpoints.md}) {
        justify-content: flex-start;
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: ${theme.spacing.sm};
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        &:before {
            content: 'Quantity: ';
            font-size: ${theme.typography.sizes.sm};
            color: ${theme.colors.lightText};
            margin-right: ${theme.spacing.sm};
            min-width: 70px;
        }
    }
`;

const TotalCell = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing.md};

    @media (max-width: ${theme.breakpoints.md}) {
        width: 100%;
        border-top: none;
        justify-content: space-between;
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        flex-wrap: nowrap;
    }
`;

const QuantityControl = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    background: ${theme.colors.background};
    
    @media (max-width: ${theme.breakpoints.md}) {
        height: 36px;
        margin-left: auto;
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        margin-left: 0;
    }
`;

const QuantityButton = styled.button`
    background: none;
    border: none;
    padding: ${theme.spacing.sm};
    cursor: pointer;
    transition: ${theme.transitions.default};
    color: ${theme.colors.text};
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;

    &:hover:not(:disabled) {
        background: ${theme.colors.secondary};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const QuantityDisplay = styled.span`
    min-width: 3rem;
    text-align: center;
    font-size: ${theme.typography.sizes.base};
    color: ${theme.colors.text};
    padding: ${theme.spacing.sm};
    border-left: 1px solid ${theme.colors.border};
    border-right: 1px solid ${theme.colors.border};
`;

const ItemSubtotal = styled.div`
    font-size: ${theme.typography.sizes.lg};
    font-weight: 600;
    color: ${theme.colors.text};
    
    @media (max-width: ${theme.breakpoints.md}) {
        &:before {
            content: 'Total: ';
            font-size: ${theme.typography.sizes.sm};
            color: ${theme.colors.lightText};
            margin-right: ${theme.spacing.sm};
            font-weight: 400;
        }
        display: flex;
        align-items: center;
    }
`;

const RemoveButton = styled.button`
    background: none;
    border: none;
    color: ${theme.colors.error};
    cursor: pointer;
    transition: ${theme.transitions.default};
    padding: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
        background: ${theme.colors.error}20;
        transform: scale(1.1);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        margin-left: auto;
        font-size: ${theme.typography.sizes.lg};
        padding: ${theme.spacing.sm};
    }
`;

const OrderSummary = styled.div`
    background: ${theme.colors.cardBg};
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.sm};
    height: fit-content;
    position: sticky;
    top: ${theme.spacing.xl};

    @media (max-width: ${theme.breakpoints.lg}) {
        position: static; /* Remove sticky positioning on smaller screens */
        margin-top: ${theme.spacing.xl}; /* Add space when stacked */
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        padding: ${theme.spacing.lg};
        border: 1px solid ${theme.colors.border};
    }
`;

const SummaryTitle = styled.h2`
    font-size: ${theme.typography.sizes.xl};
    color: ${theme.colors.text};
    margin-bottom: ${theme.spacing.lg};
`;

const SummaryItem = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: ${theme.spacing.md};
    font-size: ${theme.typography.sizes.base};
    color: ${theme.colors.text};
`;

const SummaryTotal = styled(SummaryItem)`
    border-top: 1px solid ${theme.colors.border};
    margin-top: ${theme.spacing.lg};
    padding-top: ${theme.spacing.lg};
    font-weight: 600;
    font-size: ${theme.typography.sizes.lg};
`;

const CheckoutButton = styled.button`
    width: 100%;
    background: ${theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.md};
    font-size: ${theme.typography.sizes.base};
    font-weight: 600;
    cursor: pointer;
    transition: ${theme.transitions.default};

    &:hover:not(:disabled) {
        background: ${theme.colors.primaryHover};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const EmptyCart = styled.div`
    text-align: center;
    padding: ${theme.spacing['2xl']};
    color: ${theme.colors.lightText};

    h3 {
        font-size: ${theme.typography.sizes.xl};
        color: ${theme.colors.text};
        margin: ${theme.spacing.md} 0;
    }

    p {
        margin-bottom: ${theme.spacing.xl};
    }

    svg {
        color: ${theme.colors.primary};
        opacity: 0.5;
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        padding: ${theme.spacing.lg};
        
        h3 {
            font-size: ${theme.typography.sizes.lg};
        }
        
        p {
            margin-bottom: ${theme.spacing.lg};
        }
    }
`;

const ShopNowButton = styled(Link)`
    display: inline-block;
    background: ${theme.colors.primary};
    color: white;
    text-decoration: none;
    padding: ${theme.spacing.md} ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.md};
    font-weight: 600;
    transition: ${theme.transitions.default};

    &:hover {
        background: ${theme.colors.primaryHover};
    }
`;

const LoadingWrapper = styled.div`
    text-align: center;
    padding: ${theme.spacing['2xl']};
    color: ${theme.colors.lightText};
`;

const Spinner = styled.div`
    border: 3px solid ${theme.colors.secondary};
    border-top: 3px solid ${theme.colors.primary};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto ${theme.spacing.md};

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const ErrorMessage = styled.div`
    background: ${theme.colors.error}11;
    border: 1px solid ${theme.colors.error};
    color: ${theme.colors.error};
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
    margin-bottom: ${theme.spacing.xl};
    text-align: center;
`;

const RetryButton = styled.button`
    background: none;
    border: 1px solid ${theme.colors.error};
    color: ${theme.colors.error};
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.sm};
    margin-top: ${theme.spacing.md};
    cursor: pointer;
    transition: ${theme.transitions.default};

    &:hover {
        background: ${theme.colors.error};
        color: white;
    }
`;

const CheckoutForm = styled.div`
    background: ${theme.colors.cardBg};
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.sm};
    max-width: 600px;
    margin: 0 auto;

    h3 {
        font-size: ${theme.typography.sizes.xl};
        color: ${theme.colors.text};
        margin-bottom: ${theme.spacing.lg};
    }
`;

const FormGroup = styled.div`
    margin-bottom: ${theme.spacing.md};

    label {
        display: block;
        margin-bottom: ${theme.spacing.xs};
        color: ${theme.colors.text};
        font-size: ${theme.typography.sizes.sm};
    }

    input {
        width: 100%;
        padding: ${theme.spacing.sm};
        border: 1px solid ${theme.colors.border};
        border-radius: ${theme.borderRadius.md};
        font-size: ${theme.typography.sizes.base};
        transition: ${theme.transitions.default};

        &:focus {
            outline: none;
            border-color: ${theme.colors.primary};
            box-shadow: 0 0 0 2px ${theme.colors.primary}20;
        }
    }
`;

const FormRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.md};

    @media (max-width: ${theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const Button = styled.button`
    background: ${props => props.secondary ? theme.colors.secondary : theme.colors.primary};
    color: ${props => props.secondary ? theme.colors.text : 'white'};
    border: none;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.typography.sizes.base};
    font-weight: 600;
    cursor: pointer;
    transition: ${theme.transitions.default};
    width: ${props => props.fullWidth ? '100%' : 'auto'};

    &:hover:not(:disabled) {
        background: ${props => props.secondary ? theme.colors.border : theme.colors.primaryHover};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ButtonGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.lg};

    @media (max-width: ${theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
        gap: ${theme.spacing.sm};
    }
`;

const PaymentOptions = styled.div`
    margin-bottom: ${theme.spacing.lg};
`;

const PaymentOption = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.sm};
    padding: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    cursor: pointer;
    transition: ${theme.transitions.default};

    &:hover {
        background: ${theme.colors.secondary};
    }

    input {
        accent-color: ${theme.colors.primary};
    }

    label {
        cursor: pointer;
        color: ${theme.colors.text};
    }
`;

const CartHeader = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: ${theme.spacing.lg};
    padding: ${theme.spacing.lg};
    background: ${theme.colors.secondary};
    border-radius: ${theme.borderRadius.lg};
    margin-bottom: ${theme.spacing.md};
    font-weight: 600;
    color: ${theme.colors.text};

    @media (max-width: ${theme.breakpoints.md}) {
        display: none;
    }
`;

const HeaderItem = styled.div`
    font-weight: 600;
    color: ${theme.colors.text};
    text-align: center;
    
    &:first-child {
        text-align: left;
    }
`;

const BenefitsSection = styled.div`
    margin-top: ${theme.spacing.xl};
    padding: ${theme.spacing.lg};
    background: ${theme.colors.cardBg};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.sm};

    @media (max-width: ${theme.breakpoints.lg}) {
        margin-top: ${theme.spacing.xl}; /* Ensure consistent spacing when stacked */
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
        padding: ${theme.spacing.md};
    }
`;

const Benefit = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.sm};
    color: ${theme.colors.text};
    font-size: ${theme.typography.sizes.sm};

    svg {
        color: ${theme.colors.primary};
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const MobileItemRow = styled.div`
    display: flex;
    
    @media (max-width: ${theme.breakpoints.md}) {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
    }
`;

export default CartPage;