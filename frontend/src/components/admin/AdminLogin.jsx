import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/admin/login', { email, password });
            localStorage.setItem('adminToken', data.token);
            navigate('/admin/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleSubmit}>
                <h2>Admin Login</h2>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <InputGroup>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </InputGroup>
                <InputGroup>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </InputGroup>
                <Button type="submit">Login</Button>
            </LoginForm>
        </LoginContainer>
    );
};

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f8f9fa;
`;

const LoginForm = styled.form`
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;

    h2 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 2rem;
    }
`;

const InputGroup = styled.div`
    margin-bottom: 1.5rem;

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: #4a5568;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 5px;
        font-size: 1rem;
        
        &:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 0.75rem;
    background-color: #4299e1;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #3182ce;
    }
`;

const ErrorMessage = styled.div`
    color: #e53e3e;
    background-color: #fff5f5;
    padding: 0.75rem;
    border-radius: 5px;
    margin-bottom: 1rem;
    text-align: center;
`;

export default AdminLogin;
