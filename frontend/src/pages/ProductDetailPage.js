import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getById(id).then(({ data }) => setProduct(data));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return; }
    await addToCart(product.id, qty);
    toast.success(`${product.name} added to cart! 🛍️`);
  };

  if (!product) return <div className="loading-screen"><div className="spinner"/></div>;

  return (
    <div className="detail-page">
      <div className="container detail-layout">
        <div className="detail-img-wrap">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="detail-info">
          <span className="tag">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-rating">
            {'⭐'.repeat(Math.round(product.rating||0))}
            <span>{product.rating} ({product.reviewCount?.toLocaleString()} reviews)</span>
          </div>
          <p className="detail-price">₹{product.price?.toLocaleString('en-IN')}</p>
          <p className="detail-desc">{product.description}</p>
          <div className="detail-stock">
            {product.stock > 10 ? (
              <span className="in-stock">✅ In Stock ({product.stock} available)</span>
            ) : product.stock > 0 ? (
              <span className="low-stock-warn">⚠️ Only {product.stock} left!</span>
            ) : (
              <span className="no-stock">❌ Out of Stock</span>
            )}
          </div>
          <div className="detail-actions">
            <div className="qty-wrap">
              <button onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q+1))}>+</button>
            </div>
            <button className="btn-primary" style={{flex:1, justifyContent:'center', padding:'14px'}}
              onClick={handleAdd} disabled={product.stock===0}>
              {product.stock===0 ? 'Out of Stock' : '🛍️ Add to Cart'}
            </button>
          </div>
          <div className="detail-badges">
            <span>🚚 Free delivery above ₹499</span>
            <span>↩️ 7-day easy returns</span>
            <span>🔒 Secure payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
