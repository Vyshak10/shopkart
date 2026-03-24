import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './OrdersPage.css';

const STATUS_COLOR = {
  PENDING: '#F59E0B', CONFIRMED: '#3B82F6', SHIPPED: '#8B5CF6',
  DELIVERED: '#10B981', CANCELLED: '#EF4444'
};

const STATUS_ICON = {
  PENDING: '⏳', CONFIRMED: '✅', SHIPPED: '🚚',
  DELIVERED: '📦', CANCELLED: '❌'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    orderAPI.getMyOrders()
      .then(({ data }) => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setOrders([]); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
      </div>
      <div className="container" style={{ paddingTop: 40 }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>📦 You haven't placed any orders yet.</p>
          </div>
        ) : (
          orders.map(order => {
            const itemsTotal = order.items?.reduce(
              (sum, i) => sum + (i.price * i.quantity), 0) ?? 0;
            const shipping = itemsTotal > 499 ? 0 : 49;
            const tax = Math.round(itemsTotal * 0.18);

            return (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-meta">
                    <span className="order-id">Order #{order.id}</span>
                    <span className="order-date">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      }) : '—'}
                    </span>
                  </div>
                  <span className="status-chip"
                    style={{ background: STATUS_COLOR[order.status] + '20', color: STATUS_COLOR[order.status] }}>
                    {STATUS_ICON[order.status]} {order.status}
                  </span>
                </div>

                {/* Delivery Info */}
                <div className="delivery-info">
                  <span>📍 <strong>Delivery to:</strong> {order.shippingAddress}</span>
                  {order.phone && <span>📞 {order.phone}</span>}
                </div>

                {/* Items */}
                <div className="order-items">
                  <h4>Items Ordered ({order.items?.length ?? 0})</h4>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Unit Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div className="item-name-cell">
                              {item.product?.imageUrl && (
                                <img src={item.product.imageUrl} alt={item.product?.name} className="order-item-img" />
                              )}
                              <div>
                                <p className="item-product-name">{item.product?.name ?? 'Product'}</p>
                                <small className="item-category">{item.product?.category}</small>
                              </div>
                            </div>
                          </td>
                          <td className="price-cell">₹{Number(item.price)?.toLocaleString('en-IN')}</td>
                          <td className="qty-cell">× {item.quantity}</td>
                          <td className="subtotal-cell">
                            ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cost Breakdown */}
                <div className="cost-breakdown">
                  <div className="breakdown-row">
                    <span>Items Total ({order.items?.length} item{order.items?.length !== 1 ? 's' : ''})</span>
                    <span>₹{itemsTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? '🎉 Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>GST (18%)</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="breakdown-total">
                    <span>Grand Total</span>
                    <span>₹{Number(order.totalAmount)?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
