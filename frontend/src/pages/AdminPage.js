import React, { useState, useEffect } from 'react';
import { productAPI, orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import './AdminPage.css';

const EMPTY = { name:'', description:'', price:'', stock:'', category:'', imageUrl:'' };

export default function AdminPage() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    productAPI.getAll({}).then(({ data }) => setProducts(data));
    orderAPI.getAll().then(({ data }) => setOrders(data));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await productAPI.update(editing, { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) });
        toast.success('Product updated!');
      } else {
        await productAPI.create({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock), active: true, rating: 4.5, reviewCount: 0 });
        toast.success('Product added!');
      }
      const { data } = await productAPI.getAll({});
      setProducts(data); setForm(EMPTY); setEditing(null); setShowForm(false);
    } catch { toast.error('Failed to save product'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await productAPI.delete(id);
    setProducts(p => p.filter(x => x.id !== id));
    toast.success('Product deleted');
  };

  const handleEdit = (p) => {
    setForm({ name:p.name, description:p.description, price:p.price, stock:p.stock, category:p.category, imageUrl:p.imageUrl });
    setEditing(p.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-page">
      <div className="page-header"><h1>🔑 Admin Dashboard</h1><p>Manage your store</p></div>
      <div className="container" style={{ paddingTop: 32 }}>
        <div className="admin-stats">
          {[
            { label: 'Total Products', value: products.length, icon: '📦' },
            { label: 'Total Orders', value: orders.length, icon: '🛒' },
            { label: 'Revenue', icon: '💰',
              value: `₹${orders.reduce((s,o)=>s+(o.totalAmount||0),0).toLocaleString('en-IN')}` },
            { label: 'Pending', icon: '⏳',
              value: orders.filter(o=>o.status==='PENDING').length },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <span className="stat-icon">{s.icon}</span>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-tabs">
          {['products', 'orders'].map(t => (
            <button key={t} className={`tab-btn ${tab===t?'active':''}`}
              onClick={() => setTab(t)}>
              {t === 'products' ? '📦 Products' : '📋 Orders'}
            </button>
          ))}
        </div>

        {tab === 'products' && (
          <>
            <button className="btn-primary" style={{marginBottom:20}}
              onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm); }}>
              {showForm ? 'Cancel' : '+ Add New Product'}
            </button>

            {showForm && (
              <form onSubmit={handleSave} className="product-form">
                <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
                <div className="form-grid">
                  {[['name','Product Name','text'],['price','Price (₹)','number'],
                    ['stock','Stock','number'],['category','Category','text'],
                    ['imageUrl','Image URL','url']].map(([key,label,type]) => (
                    <div key={key} className="form-group">
                      <label>{label}</label>
                      <input type={type} placeholder={label} required={key!=='imageUrl'}
                        value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} />
                    </div>
                  ))}
                  <div className="form-group span-2">
                    <label>Description</label>
                    <textarea rows={2} placeholder="Product description..."
                      value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  {editing ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            )}

            <table className="admin-table">
              <thead>
                <tr><th>#</th><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td><img src={p.imageUrl} alt={p.name} className="table-img" /></td>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="tag">{p.category}</span></td>
                    <td>₹{p.price?.toLocaleString('en-IN')}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button className="btn-secondary" style={{marginRight:8,padding:'6px 14px',fontSize:12}} onClick={() => handleEdit(p)}>Edit</button>
                      <button onClick={() => handleDelete(p.id)}
                        style={{background:'#FEE2E2',color:'#DC2626',border:'none',padding:'6px 14px',borderRadius:8,cursor:'pointer',fontSize:12,fontWeight:700}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'orders' && (
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th><th>Update</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.user?.name || 'N/A'}</td>
                  <td>₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                  <td><span className="tag">{o.status}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <select defaultValue={o.status}
                      onChange={async (e) => {
                        await orderAPI.updateStatus(o.id, e.target.value);
                        toast.success('Status updated');
                      }}
                      style={{padding:'6px 10px',borderRadius:8,border:'1px solid var(--border)',fontSize:12}}>
                      {['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
