import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// CORRECT IMPORT: Use getFilteredItems
import { getFilteredItems } from '../services/api'; // <-- CORRECTED IMPORT
import ItemCard from '../components/ItemCard';
import '../App.css';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchTerm = searchParams.get('term');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true; // Prevent state update on unmounted component
        if (!searchTerm) {
            setItems([]);
            setError("Please enter a search term.");
            setLoading(false);
            return; // Don't fetch if no term
        };

        const fetchResults = async () => {
            setLoading(true);
            setError('');
            try {
                // CORRECT API CALL: Use getFilteredItems with params object
                const response = await getFilteredItems({ search: searchTerm }); // <-- CORRECTED CALL
                if (isMounted) {
                    setItems(response.data);
                }
            } catch (err) {
                console.error(`Error searching for "${searchTerm}":`, err);
                 if (isMounted) {
                    setError(`Failed to load search results for "${searchTerm}".`);
                }
            } finally {
                 if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchResults();

        return () => { isMounted = false; }; // Cleanup function

    }, [searchTerm]); // Re-fetch if searchTerm changes

    if (loading) return <div className="page-container loading-indicator"><p>Searching for "{searchTerm}"...</p></div>;

    return (
        <div className="search-results-page page-container">
            <button onClick={() => navigate('/')} className="back-button">← Back Home</button>
            <h2>Search Results for: "{searchTerm}"</h2>
            {error && <p className="message error">{error}</p>}
            {items.length > 0 ? (
                <div className="items-grid">
                    {items.map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                !error && <p>No items found matching "{searchTerm}".</p>
            )}
        </div>
    );
};

export default SearchResultsPage;
