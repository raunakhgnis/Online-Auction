import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// CORRECT IMPORT: Use getFilteredItems
import { getFilteredItems, getAllItems } from '../services/api'; // <-- CORRECTED IMPORT
import ItemCard from '../components/ItemCard';
import '../App.css'; // Assuming ItemCard uses some styles from here or its own CSS

const CategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [title, setTitle] = useState(''); // State for dynamic title

    useEffect(() => {
        let isMounted = true; // Prevent state update on unmounted component
        const fetchItems = async () => {
            setLoading(true);
            setError('');
            try {
                let response;
                // Handle "All" category or default case
                if (!categoryName || categoryName.toLowerCase() === 'all') {
                    setTitle('All Products');
                    response = await getAllItems(); // Use dedicated function if available
                    // Or response = await getFilteredItems({}); // If getFilteredItems handles empty params
                } else {
                    setTitle(categoryName); // Set title from param
                    // CORRECT API CALL: Use getFilteredItems with params object
                    response = await getFilteredItems({ category: categoryName }); // <-- CORRECTED CALL
                }
                if (isMounted) {
                    setItems(response.data);
                }
            } catch (err) {
                console.error(`Error fetching items for category ${categoryName || 'All'}:`, err);
                if (isMounted) {
                    setError(`Failed to load items for category "${categoryName || 'All'}".`);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchItems();

        return () => { isMounted = false; }; // Cleanup function

    }, [categoryName]); // Re-fetch if categoryName changes

    if (loading) return <div className="page-container loading-indicator"><p>Loading items for {title || categoryName}...</p></div>;

    return (
        <div className="category-page page-container">
            <button onClick={() => navigate('/')} className="back-button">← Back Home</button>
            <h2>Category: {title || categoryName}</h2>
            {error && <p className="message error">{error}</p>}
            {items.length > 0 ? (
                <div className="items-grid">
                    {items.map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                !error && <p>No items found in the "{title || categoryName}" category.</p>
            )}
        </div>
    );
};

export default CategoryPage;
