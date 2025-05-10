import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllItems } from '../services/api';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import './HomePage.css'; // Ensure this CSS file is imported

const MAX_FEATURED_POOL_SIZE = 10;
const ROTATION_INTERVAL = 7000;
const TRANSITION_DURATION = 500; // Milliseconds for fade transition

const HomePage = () => {
    const [allItems, setAllItems] = useState([]);
    const [featuredItemsPool, setFeaturedItemsPool] = useState([]);
    const [currentMainItem, setCurrentMainItem] = useState(null);
    const [currentLeftItem, setCurrentLeftItem] = useState(null);
    const [currentRightItem, setCurrentRightItem] = useState(null);
    const [displayKey, setDisplayKey] = useState(0); // Key to trigger re-render/transition
    const [isTransitioning, setIsTransitioning] = useState(false); // To manage opacity during transition

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const selectNewFeaturedSet = useCallback(() => {
        if (featuredItemsPool.length === 0) {
            setCurrentMainItem(null);
            setCurrentLeftItem(null);
            setCurrentRightItem(null);
            return;
        }

        setIsTransitioning(true); // Start fade out

        // Wait for fade-out to complete before updating items
        setTimeout(() => {
            let mainItem, leftItem, rightItem;
            const pool = [...featuredItemsPool];

            const mainIndex = Math.floor(Math.random() * pool.length);
            mainItem = pool.splice(mainIndex, 1)[0];

            if (pool.length > 0) {
                const leftIndex = Math.floor(Math.random() * pool.length);
                leftItem = pool.splice(leftIndex, 1)[0];
            } else {
                leftItem = null;
            }

            if (pool.length > 0) {
                const rightIndex = Math.floor(Math.random() * pool.length);
                rightItem = pool.splice(rightIndex, 1)[0];
            } else {
                rightItem = null;
            }

            setCurrentMainItem(mainItem);
            setCurrentLeftItem(leftItem);
            setCurrentRightItem(rightItem);
            setDisplayKey(prevKey => prevKey + 1); // Change key to force re-render
            setIsTransitioning(false); // Start fade in (opacity will go to 1 via CSS)
        }, TRANSITION_DURATION / 2); // Half duration for fade out, half for fade in

    }, [featuredItemsPool]);

    useEffect(() => {
        let isMounted = true;
        const fetchAllItemsData = async () => {
            // ... (data fetching logic remains the same) ...
             setLoading(true);
            setError('');
            try {
                const response = await getAllItems();
                if (isMounted) {
                    const fetchedItems = response.data;
                    setAllItems(fetchedItems);
                    const shuffled = [...fetchedItems].sort(() => 0.5 - Math.random());
                    setFeaturedItemsPool(shuffled.slice(0, MAX_FEATURED_POOL_SIZE));
                }
            } catch (err) {
                console.error("Error fetching items:", err);
                if (isMounted) setError("Failed to load auction items.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchAllItemsData();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (featuredItemsPool.length > 0) {
            selectNewFeaturedSet(); // Initial selection
            if (featuredItemsPool.length > 1) { // Only rotate if more than one possible set
                const intervalId = setInterval(selectNewFeaturedSet, ROTATION_INTERVAL);
                return () => clearInterval(intervalId);
            }
        }
    }, [featuredItemsPool, selectNewFeaturedSet]);

    const trendingItems = allItems.filter(item =>
        (!currentMainItem || item.id !== currentMainItem.id) &&
        (!currentLeftItem || item.id !== currentLeftItem.id) &&
        (!currentRightItem || item.id !== currentRightItem.id)
    ).slice(0, 6);

    if (loading) return <div className="page-container loading-indicator"><p>Loading auctions...</p></div>;
    if (error) return <div className="page-container"><p className="message error">{error}</p></div>;

    return (
        <div className="homepage-content">
            <section
                key={displayKey} // This key changing triggers a re-render of this section
                className={`featured-banner-actual ${isTransitioning ? 'fade-out' : 'fade-in'}`}
            >
                {currentLeftItem ? (
                   <img
                    src={currentLeftItem.imageUrl || `https://via.placeholder.com/150x100?text=${currentLeftItem.name.split(" ")[0]}`}
                    alt={`${currentLeftItem.name} - background`}
                    className="blurred-side-image"
                   />
                ) : <div className="blurred-side-placeholder"></div>}

                {currentMainItem ? (
                    <div className="featured-item-container">
                        <img
                            src={currentMainItem.imageUrl || `https://via.placeholder.com/300x200?text=${currentMainItem.name}`}
                            alt={currentMainItem.name}
                        />
                        <h4>{currentMainItem.name}</h4>
                        <p>Starts at: ~${currentMainItem.startingPrice?.toFixed(2)}</p>
                        <p>Ends: {new Date(currentMainItem.auctionEndTime).toLocaleDateString()}</p>
                        <Link to={`/products/${currentMainItem.id}`} className="view-details-btn">View Details</Link>
                    </div>
                ) : (
                    <div className="featured-item-container placeholder">
                        <p>Loading featured item...</p>
                    </div>
                )}

                {currentRightItem ? (
                   <img
                    src={currentRightItem.imageUrl || `https://via.placeholder.com/150x100?text=${currentRightItem.name.split(" ")[0]}`}
                    alt={`${currentRightItem.name} - background`}
                    className="blurred-side-image"
                   />
                ): <div className="blurred-side-placeholder"></div>}
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                {/* ... (Categories JSX remains the same) ... */}
                 <h3>Shop by Categories</h3>
                <div className="category-grid">
                    <Link to="/category/Fashion" className="category-item">👕<span>Fashion</span></Link>
                    <Link to="/category/Art" className="category-item">🎨<span>Art</span></Link>
                    <Link to="/category/Vehicle" className="category-item">🚗<span>Vehicle</span></Link>
                    <Link to="/category/Collectibles" className="category-item">💎<span>Collectibles</span></Link>
                    <Link to="/category/Electronics" className="category-item">💻<span>Electronics</span></Link>
                </div>
            </section>

            {/* Search Bar Section */}
            <section className="search-section">
               <SearchBar />
            </section>

            {/* Trending Auctions Section */}
            <section className="items-grid-section">
                 <h3>Trending Auctions</h3>
                {trendingItems.length > 0 ? (
                    <div className="items-grid">
                        {trendingItems.map(item => (
                            <ItemCard key={`trending-${item.id}`} item={item} />
                        ))}
                    </div>
                ) : (
                   <p>No current auction items available to display here.</p>
                )}
            </section>
        </div>
    );
};
export default HomePage;
