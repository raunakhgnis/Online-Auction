// import React from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import './Navbar.css';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const { currentUser, logout } = useAuth();

//     const handleLogout = async () => {
//         await logout();
//         navigate('/login');
//     };

//     // Function to determine if a link is active for NavLink
//     const getNavLinkClass = ({ isActive }) => isActive ? "nav-link active-nav" : "nav-link";

//     return (
//         <nav className="navbar">
//             <Link to="/" className="navbar-brand">
//                 {/* Optional: <img src="/path/to/logo.png" alt="Logo" className="navbar-logo" /> */}
//                 Online Auction
//             </Link>
//             <ul className="nav-links">
//                 <li><NavLink to="/" className={getNavLinkClass}>Home</NavLink></li>
//                 <li><NavLink to="/category/All" className={getNavLinkClass}>Products</NavLink></li> {/* Link to a default category or all items */}

//                 {currentUser ? (
//                     <>
//                          <li><NavLink to="/add-item" className={getNavLinkClass}>Add Item</NavLink></li>
//                          <li><NavLink to="/profile" className={getNavLinkClass}>Profile</NavLink></li>
//                         <li><span className="nav-welcome">Welcome, {currentUser.email}!</span></li>
//                         <li><button onClick={handleLogout} className="nav-button-logout">Logout</button></li>
//                     </>
//                 ) : (
//                     <>
//                         <li><NavLink to="/login" className={getNavLinkClass}>Login</NavLink></li>
//                         <li><NavLink to="/signup" className={getNavLinkClass}>Signup</NavLink></li>
//                     </>
//                 )}
//             </ul>
//         </nav>
//     );
// };

// export default Navbar;



// import React from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import logoImage from '../assets/logo.png'; // <--- IMPORT YOUR LOGO IMAGE
// import './Navbar.css';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const { currentUser, logout } = useAuth();

//     const handleLogout = async () => {
//         await logout();
//         navigate('/login');
//     };

//     const getNavLinkClass = ({ isActive }) => isActive ? "nav-link active-nav" : "nav-link";

//     return (
//         <nav className="navbar">
//             <Link to="/" className="navbar-brand">
//                 <img src={logoImage} alt="Online Auction Logo" className="navbar-logo" /> {/* <--- USE THE IMPORTED IMAGE */}
//                 <span>Online Auction</span> {/* Keep the text or remove if logo is enough */}
//             </Link>
//             <ul className="nav-links">
//                 <li><NavLink to="/" className={getNavLinkClass}>Home</NavLink></li>
//                 <li><NavLink to="/category/All" className={getNavLinkClass}>Products</NavLink></li>

//                 {currentUser ? (
//                     <>
//                          <li><NavLink to="/add-item" className={getNavLinkClass}>Add Item</NavLink></li>
//                          <li><NavLink to="/profile" className={getNavLinkClass}>Profile</NavLink></li>
//                         <li><span className="nav-welcome">Welcome, {currentUser.email}!</span></li>
//                         <li><button onClick={handleLogout} className="nav-button-logout">Logout</button></li>
//                     </>
//                 ) : (
//                     <>
//                         <li><NavLink to="/login" className={getNavLinkClass}>Login</NavLink></li>
//                         <li><NavLink to="/signup" className={getNavLinkClass}>Signup</NavLink></li>
//                     </>
//                 )}
//             </ul>
//         </nav>
//     );
// };

// export default Navbar;




import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../assets/logo.png'; // Assuming logo.jpg is in src/assets
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getNavLinkClass = ({ isActive }) => isActive ? "nav-link active-nav" : "nav-link";

    return (
        <nav className="navbar">
            {/* The entire .navbar-brand is a Link, making the logo and text clickable */}
            <Link to="/" className="navbar-brand">
                <img src={logoImage} alt="Online Auction Logo" className="navbar-logo" />
                <span>Online Auction</span>
            </Link>

            <ul className="nav-links">
                <li><NavLink to="/" className={getNavLinkClass}>Home</NavLink></li>
                <li><NavLink to="/category/All" className={getNavLinkClass}>Products</NavLink></li>

                {currentUser ? (
                    <>
                        <li><NavLink to="/add-item" className={getNavLinkClass}>Add Item</NavLink></li>
                        <li><NavLink to="/profile" className={getNavLinkClass}>Profile</NavLink></li>
                        <li><span className="nav-welcome">Welcome, {currentUser.email}!</span></li>
                        <li><button onClick={handleLogout} className="nav-button-logout">Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/login" className={getNavLinkClass}>Login</NavLink></li>
                        <li><NavLink to="/signup" className={getNavLinkClass}>Signup</NavLink></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
