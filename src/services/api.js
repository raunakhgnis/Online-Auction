// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const userString = localStorage.getItem('auctionUser');
    if (userString) {
        try {
            const user = JSON.parse(userString);
            if (user && user.token) {
                return { Authorization: `Bearer ${user.token}` };
            }
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
            localStorage.removeItem('auctionUser'); // Clear corrupted data
        }
    }
    return {}; // Return empty object if no token
};

// --- Auth Service ---
export const login = (email, password) => axios.post(`${API_URL}/auth/login`, { email, password });
export const signup = (email, password) => axios.post(`${API_URL}/auth/signup`, { email, password });
export const logout = () => {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
        axios.post(`${API_URL}/auth/logout`, {}, { headers }).catch(err => console.warn("Backend logout failed", err));
    }
    // Note: Actual state clearing happens in AuthContext, localStorage is cleared there too
};

// --- Item Service ---
export const getAllItems = () => axios.get(`${API_URL}/items`);
// Fetch by category or search using query parameters on the main /items endpoint
export const getFilteredItems = (params) => axios.get(`${API_URL}/items`, { params }); // e.g., { category: 'Art' } or { search: 'car' }
export const getItemById = (id) => axios.get(`${API_URL}/items/${id}`);
export const addItem = (itemData) => {
    // Ensure necessary fields are present before sending
    const requiredFields = ['name', 'description', 'category', 'startingPrice', 'imageUrl', 'auctionEndTime'];
    for (const field of requiredFields) {
        if (!itemData[field]) {
            console.error(`Missing required field for adding item: ${field}`);
            // Consider throwing an error or returning a rejected promise
            return Promise.reject(new Error(`Missing required field: ${field}`));
        }
    }
    return axios.post(`${API_URL}/items`, itemData, { headers: getAuthHeaders() });
};


// --- Bid Service ---
export const placeBid = (itemId, amount) => {
     if (typeof amount !== 'number' || amount <= 0) {
        return Promise.reject(new Error('Invalid bid amount provided.'));
    }
    return axios.post(`${API_URL}/items/${itemId}/bid`, { amount }, { headers: getAuthHeaders() });
}
export const getBidsForItem = (itemId) => axios.get(`${API_URL}/items/${itemId}/bids`); // Might not need auth depending on backend

// --- User Profile Service ---
export const getMyListedItems = () => axios.get(`${API_URL}/users/me/items`, { headers: getAuthHeaders() });
export const getMyBids = () => axios.get(`${API_URL}/users/me/bids`, { headers: getAuthHeaders() });

// --- Payment Service ---
export const initiateItemPayment = (itemId) => {
    console.log(`Calling payment endpoint for item ${itemId}`); // Debug log
    return axios.post(`${API_URL}/items/${itemId}/pay`, {}, { headers: getAuthHeaders() });
};


