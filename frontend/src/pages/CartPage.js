import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './CartPage.css';

export default function CartPage() {
  const { cart, total, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/login'); return null; }
  const shipping = total > 499 ? 0 : 49;
  const tax = Math.round(total * 0.18);
  const grandTotal = total + shipping + tax;

  if (cart.length === 0) return (
    <div className="empty-cart">
      <div className="empty-cart-inner">
        <span>🛒</span>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary">Start Shopping →</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="page-header"><h1>Shopping Cart</h1><p>{cart.length} items</p></div>
      <div className="container cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.productName} className="cart-item-img" />
              <div className="cart-item-info">
                <h3>{item.productName}</h3>
                <p className="cart-item-price">₹{item.price?.toLocaleString('en-IN')}</p>
              </div>
              <div className="qty-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <p className="cart-item-subtotal">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </p>
              <button className="remove-btn" onClick={() => {
                removeFromCart(item.id); toast.info('Item removed');
              }}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div>
          <div className="summary-row"><span>Shipping</span>
            <span>{shipping === 0 ? '🎉 Free' : `₹${shipping}`}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
          <div className="summary-total">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
          {shipping > 0 && (
            <p className="free-ship-note">Add ₹{(499 - total).toFixed(0)} more for free shipping!</p>
          )}
          <button className="btn-primary checkout-btn"
            onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
          <Link to="/products" className="continue-link">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
