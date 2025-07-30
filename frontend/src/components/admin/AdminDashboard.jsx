import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, statsRes] = await Promise.all([
                axios.get('/api/admin/orders'),
                axios.get('/api/admin/dashboard')
            ]);
            setOrders(ordersRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            await axios.put(`/api/admin/orders/${orderId}`, { status });
            fetchDashboardData();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (loading) {
        return <LoadingWrapper>Loading...</LoadingWrapper>;
    }

    return (
        <DashboardContainer>
            <Header>
                <h1>Admin Dashboard</h1>
            </Header>

            <StatsContainer>
                <StatCard>
                    <h3>Total Orders</h3>
                    <p>{stats.totalOrders}</p>
                </StatCard>
                <StatCard>
                    <h3>Pending Orders</h3>
                    <p>{stats.pendingOrders}</p>
                </StatCard>
                <StatCard>
                    <h3>Total Revenue</h3>
                    <p>${stats.totalRevenue.toFixed(2)}</p>
                </StatCard>
            </StatsContainer>

            <OrdersSection>
                <h2>Recent Orders</h2>
                <OrdersTable>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user.name}</td>
                                <td>${order.totalAmount.toFixed(2)}</td>
                                <td>
                                    <StatusBadge status={order.status}>
                                        {order.status}
                                    </StatusBadge>
                                </td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </OrdersTable>
            </OrdersSection>
        </DashboardContainer>
    );
};

const DashboardContainer = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const Header = styled.div`
    margin-bottom: 2rem;
    h1 {
        color: #2c3e50;
        font-size: 2rem;
    }
`;

const StatsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const StatCard = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    h3 {
        color: #7f8c8d;
        margin-bottom: 0.5rem;
    }
    p {
        font-size: 1.8rem;
        font-weight: bold;
        color: #2c3e50;
    }
`;

const OrdersSection = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const OrdersTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    
    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
    }
    
    th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
`;

const StatusBadge = styled.span`
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: capitalize;
    
    ${({ status }) => {
        switch (status) {
            case 'pending':
                return 'background-color: #fff3cd; color: #856404;';
            case 'approved':
                return 'background-color: #d4edda; color: #155724;';
            case 'processing':
                return 'background-color: #cce5ff; color: #004085;';
            case 'shipped':
                return 'background-color: #e2e3e5; color: #383d41;';
            case 'delivered':
                return 'background-color: #d1e7dd; color: #0f5132;';
            case 'rejected':
                return 'background-color: #f8d7da; color: #721c24;';
            default:
                return 'background-color: #f8f9fa; color: #343a40;';
        }
    }}
`;

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.2rem;
    color: #2c3e50;
`;

export default AdminDashboard;
