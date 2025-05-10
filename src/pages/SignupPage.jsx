import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css'; // Reuse or create new styles

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const SignupPage = ({ navigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, { email, password });
            setMessage(response.data.message || "Signup successful! Please login.");
            // Optionally navigate to login after a delay or directly
            // navigate('login');
        } catch (error) {
            setMessage(error.response?.data?.message || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="auth-form-container page-container">
            <h2>Get Started Now</h2>
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
                <button type="submit" className="auth-button">Sign Up</button>
            </form>
            <button onClick={() => navigate('login')} className="switch-auth-link">
                Already have an account? Login
            </button>
        </div>
    );
};
export default SignupPage;
