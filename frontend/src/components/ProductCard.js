import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart! 🛍️`);
    } catch { toast.error('Failed to add to cart'); }
  };

  const stars = (r) => '⭐'.repeat(Math.round(r || 0));

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-img-wrap">
        <img src={product.imageUrl} alt={product.name} className="product-img" />
        <span className="product-category-tag">{product.category}</span>
        {product.stock < 10 && product.stock > 0 && (
          <span className="low-stock-badge">Only {product.stock} left!</span>
        )}
        {product.stock === 0 && <span className="out-badge">Out of Stock</span>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description?.substring(0, 70)}...</p>
        <div className="product-rating">
          <span>{stars(product.rating)}</span>
          <span className="rating-text">{product.rating} ({product.reviewCount?.toLocaleString()})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">₹{product.price?.toLocaleString('en-IN')}</span>
          <button
            className="btn-primary add-btn"
            onClick={handleAdd}
            disabled={product.stock === 0}>
            {product.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
