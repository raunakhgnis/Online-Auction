import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addItem } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './AuthForm.css'; // Reuse auth form styles or create new

const AddItemPage = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth(); // Need logout for potential 401
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Other'); // Default category
    const [startingPrice, setStartingPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [auctionEndTime, setAuctionEndTime] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!currentUser) {
            setError("Authentication error. Please log in again.");
            return;
        }

        const itemData = {
            name,
            description,
            category,
            startingPrice: parseFloat(startingPrice),
            imageUrl,
            auctionEndTime // Send as string, backend parses ISO format
        };

        // Basic validation
        if (isNaN(itemData.startingPrice) || itemData.startingPrice <= 0) {
             setError("Starting price must be a positive number.");
             return;
        }
        if (!itemData.auctionEndTime) {
            setError("Auction end time is required.");
            return;
        }

        try {
            const response = await addItem(itemData);
            setMessage(`Item "${response.data.name}" added successfully!`);
            // Clear form or navigate away
            // setName(''); setDescription(''); setCategory('Other'); // etc.
            navigate(`/products/${response.data.id}`); // Navigate to the new item's page
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add item.");
            if (err.response && err.response.status === 401) {
                await logout();
                navigate('/login'); // Redirect on auth error
            }
        }
    };

    return (
        <div className="auth-form-container page-container"> {/* Reuse class */}
            <h2>Add New Item for Auction</h2>
            {error && <p className="message error">{error}</p>}
            {message && <p className="message success">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Item Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}></textarea>
                </div>
                 <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                        <option value="Art">Art</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Collectibles">Collectibles</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Jewelry">Jewelry</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="startingPrice">Starting Price ($)</label>
                    <input type="number" id="startingPrice" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} step="0.01" min="0.01" required />
                </div>
                 <div className="form-group">
                    <label htmlFor="imageUrl">Image URL</label>
                    <input type="url" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" required />
                </div>
                <div className="form-group">
                     <label htmlFor="auctionEndTime">Auction End Date & Time</label>
                     {/* Use datetime-local for easy input, backend expects ISO format */}
                    <input type="datetime-local" id="auctionEndTime" value={auctionEndTime} onChange={(e) => setAuctionEndTime(e.target.value)} required />
                </div>

                <button type="submit" className="auth-button">List Item</button>
            </form>
        </div>
    );
};
export default AddItemPage;
