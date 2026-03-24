import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🛒 ShopKart</span>
          <p>India's favourite online store.<br />Shop smarter, live better.</p>
        </div>
        <div className="footer-links">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Clothing">Clothing</Link>
        </div>
        <div className="footer-links">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/orders">My Orders</Link>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>📍 Kozhikode, Kerala, India</p>
          <p>📧 support@shopkart.in</p>
          <p>📞 +91 98765 43210</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 ShopKart. Built with ❤️ in India | React.js + Spring Boot + MySQL</p>
      </div>
    </footer>
  );
}
