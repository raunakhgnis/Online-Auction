import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './AuthForm.css'; // Create or use global styles
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

//const LoginPage = ({ navigate }) => {
const LoginPage = () => {
    
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        // try {
        //     const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        //     login({ email: response.data.email, token: response.data.token });
        //     navigate('home');
        // } catch (error) {
        //     setMessage(error.response?.data?.message || "Login failed. Please check credentials.");
        // }

        try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });

    // Catch any frontend-level issues during login or navigation
    try {
        login({ email: response.data.email, token: response.data.token });
        setMessage("Login successful!"); // Optional, for user feedback
        navigate('home');
    } catch (err) {
        console.error("Login handling error:", err);
        setMessage("Login succeeded but frontend processing failed.");
    }

} catch (error) {
    console.error("Login request failed:", error);
    setMessage(error.response?.data?.message || "Login failed. Please check credentials.");
}

    };

    return (
        <div className="auth-form-container page-container">
            <h2>Welcome back!</h2>
            <p>Enter your Credentials to access your account</p>
            {message && <p className={`message ${message.toLowerCase().includes("error") || message.toLowerCase().includes("failed") ? 'error' : 'success'}`}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="auth-button">Login</button>
            </form>
            <button onClick={() => navigate('signup')} className="switch-auth-link">
                Don't have an account? Sign Up
            </button>
        </div>
    );
};
export default LoginPage;
