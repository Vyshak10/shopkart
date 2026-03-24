import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Electronics', icon: '📱', color: '#6C63FF' },
  { name: 'Footwear', icon: '👟', color: '#FF6584' },
  { name: 'Clothing', icon: '👕', color: '#43E97B' },
  { name: 'Home & Kitchen', icon: '🏠', color: '#F6D365' },
  { name: 'Books', icon: '📚', color: '#A8EDEA' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    productAPI.getAll({}).then(({ data }) => setFeatured(data.slice(0, 8)));
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">🇮🇳 Made for India</span>
            <h1>Shop the <span className="gradient-text">Best Deals</span><br />Across India</h1>
            <p>Discover thousands of products at unbeatable prices.<br />Fast delivery, easy returns, secure payments.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn-primary">Shop Now →</Link>
              <Link to="/register" className="btn-secondary">Join Free</Link>
            </div>
            <div className="hero-stats">
              <div><strong>50K+</strong><span>Products</span></div>
              <div><strong>2M+</strong><span>Customers</span></div>
              <div><strong>4.8★</strong><span>Rating</span></div>
            </div>
          </div>
          <div className="hero-image">🛒</div>
        </div>
      </section>

      {/* Banners */}
      <section className="section container">
        <div className="promo-banners">
          <div className="promo-card promo-1">
            <h3>Up to 40% Off</h3>
            <p>Electronics Sale</p>
            <Link to="/products?category=Electronics" className="btn-primary">Shop Now</Link>
          </div>
          <div className="promo-card promo-2">
            <h3>New Arrivals</h3>
            <p>Fresh Styles Daily</p>
            <Link to="/products?category=Clothing" className="btn-primary">Explore</Link>
          </div>
          <div className="promo-card promo-3">
            <h3>Free Delivery</h3>
            <p>Orders above ₹499</p>
            <Link to="/products" className="btn-primary">Order Now</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Find exactly what you're looking for</p>
        <div className="category-grid">
          {CATEGORIES.map(c => (
            <Link to={`/products?category=${c.name}`} key={c.name}
              className="category-card" style={{ '--cat-color': c.color }}>
              <span className="cat-icon">{c.icon}</span>
              <span className="cat-name">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section container">
        <h2 className="section-title">🔥 Featured Products</h2>
        <p className="section-subtitle">Handpicked bestsellers just for you</p>
        <div className="grid-4">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/products" className="btn-primary">View All Products →</Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="container trust-grid">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
            { icon: '🔒', title: 'Secure Payment', desc: 'JWT-secured transactions' },
            { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy' },
            { icon: '⚡', title: 'Fast Support', desc: '24/7 customer care' },
          ].map(t => (
            <div key={t.title} className="trust-card">
              <span className="trust-icon">{t.icon}</span>
              <div><strong>{t.title}</strong><p>{t.desc}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
