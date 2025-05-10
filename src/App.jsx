import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddItemPage from './pages/AddItemPage';
import ProfilePage from './pages/ProfilePage';
import CategoryPage from './pages/CategoryPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
//import Payment from './pages/PaymentGateway';

import BidPaymentPage from './pages/BidPaymentPage';
import { useAuth } from './contexts/AuthContext';
import './App.css';

// Layout Component
const Layout = () => (
    <>
        <Navbar />
        <main className="app-content-area"><Outlet /></main>
        <Footer />
    </>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    if (loading) return <div className="loading-indicator">Checking authentication...</div>;
    return currentUser ? children : <Navigate to="/login" replace />;
};

function App() {
    const { loading: authLoading } = useAuth();
    if (authLoading) return <div className="app-loading">Loading Application...</div>;

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="category/:categoryName" element={<CategoryPage />} />
                <Route path="search" element={<SearchResultsPage />} />
                <Route path="add-item" element={<ProtectedRoute><AddItemPage /></ProtectedRoute>}/>
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
                <Route path="about" element={<AboutPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="contact" element={<ContactPage />} />
                {/* <Route path="payment" element={<Payment />} /> */}

                 <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="bid-payment/:id" element={ // New route for payment
                    <ProtectedRoute>
                        <BidPaymentPage />
                    </ProtectedRoute>
                }/>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}

export default App;
