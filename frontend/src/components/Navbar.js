import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo">🛒 ShopKart</Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          {user && <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-icon">
                🛍️
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <span className="nav-user">Hi, {user.name?.split(' ')[0] ?? user.email}</span>
              <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>
    </nav>
  );
}
