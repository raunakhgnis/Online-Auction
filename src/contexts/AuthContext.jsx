import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Make sure axios is installed

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const AuthContext = createContext(null); // Initialize with null

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start loading

    useEffect(() => {
        // Check localStorage for existing user session on initial app load
        const storedUser = localStorage.getItem('auctionUser');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                 // Basic check if token exists
                if (parsedUser && parsedUser.token) {
                     // TODO: Optional - Add an API call here to verify token validity with backend
                     // If valid, setCurrentUser(parsedUser)
                     // If invalid, localStorage.removeItem('auctionUser')
                    setCurrentUser(parsedUser);
                } else {
                     localStorage.removeItem('auctionUser'); // Clear invalid data
                }
            } catch (error) {
                console.error("Failed to parse stored user:", error);
                localStorage.removeItem('auctionUser');
            }
        }
        setLoading(false); // Finished check
    }, []);

    const login = (userData) => {
        // Expects userData to have { email: '...', token: '...' } from backend
        if (userData && userData.email && userData.token) {
            setCurrentUser(userData);
            localStorage.setItem('auctionUser', JSON.stringify(userData));
            console.log("User logged in and stored:", userData.email);
        } else {
            console.error("Login function called with invalid userData:", userData);
            // Clear potentially bad state
            setCurrentUser(null);
            localStorage.removeItem('auctionUser');
        }
    };

    const logout = async () => {
        const userToLogout = currentUser; // Capture before clearing state
        setCurrentUser(null);
        localStorage.removeItem('auctionUser');
        console.log("User logged out locally.");

        // Attempt backend logout (fire-and-forget)
        if (userToLogout && userToLogout.token) {
            try {
                await axios.post(`${API_URL}/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${userToLogout.token}` }
                });
                console.log("Backend logout called.");
            } catch (error) {
                console.warn("Backend logout call failed:", error.response?.data || error.message);
            }
        }
    };

    const value = {
        currentUser,
        login,
        logout,
        loading // Provide loading state
    };

    // Only render children when not loading initial auth state
    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div className="app-loading">Initializing...</div>}
        </AuthContext.Provider>
    );
};
