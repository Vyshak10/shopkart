import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ shippingAddress: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const shipping = total > 499 ? 0 : 49;
  const tax = Math.round(total * 0.18);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await orderAPI.place(form);
      await clearCart();
      setPlaced(true);
      toast.success('Order placed successfully! 🎉');
      setTimeout(() => navigate('/orders'), 2000);
    } catch { toast.error('Failed to place order'); }
    finally { setLoading(false); }
  };

  if (placed) return (
    <div className="order-success">
      <div className="success-card">
        <span className="success-icon">✅</span>
        <h2>Order Placed!</h2>
        <p>Thank you for shopping with ShopKart.</p>
        <p>Redirecting to your orders...</p>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="page-header"><h1>Checkout</h1><p>Almost there!</p></div>
      <div className="container checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Delivery Details</h3>
          <div className="form-group">
            <label>Delivery Address</label>
            <textarea rows={3} placeholder="Enter your full delivery address..." required
              value={form.shippingAddress}
              onChange={e => setForm({...form, shippingAddress: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="+91 98765 43210" required
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <h3 style={{marginTop:24}}>Payment Method</h3>
          <div className="payment-option selected">
            <span>💳</span><span>Cash on Delivery (COD)</span>
            <span className="badge">Selected</span>
          </div>
          <button type="submit" className="btn-primary checkout-btn" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order · ₹${(total+shipping+tax).toLocaleString('en-IN')}`}
          </button>
        </form>

        <div className="order-review">
          <h3>Order Review ({cart.length} items)</h3>
          {cart.map(i => (
            <div key={i.id} className="review-item">
              <img src={i.imageUrl} alt={i.productName} />
              <div>
                <p>{i.productName}</p>
                <small>Qty: {i.quantity}</small>
              </div>
              <span>₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="review-totals">
            <div><span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div>
            <div><span>Shipping</span><span>{shipping===0?'Free':`₹${shipping}`}</span></div>
            <div><span>GST</span><span>₹{tax}</span></div>
            <div className="review-grand"><span>Total</span>
              <span>₹{(total+shipping+tax).toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
