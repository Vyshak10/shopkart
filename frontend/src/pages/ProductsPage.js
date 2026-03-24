import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import './ProductsPage.css';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const [sort, setSort] = useState('default');

  useEffect(() => {
    productAPI.getCategories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    productAPI.getAll({ category: activeCategory, search })
      .then(({ data }) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeCategory, search]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Our Products</h1>
        <p>{products.length} products found</p>
      </div>
      <div className="container products-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Categories</h3>
          <button
            className={`cat-btn ${!activeCategory ? 'active' : ''}`}
            onClick={() => setSearchParams({})}>All Products</button>
          {categories.map(c => (
            <button key={c}
              className={`cat-btn ${activeCategory === c ? 'active' : ''}`}
              onClick={() => setSearchParams({ category: c })}>{c}</button>
          ))}
        </aside>

        {/* Main */}
        <div className="products-main">
          <div className="products-toolbar">
            <input
              className="search-input" placeholder="🔍 Search products..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="empty-state">
              <p>😕 No products found</p>
              <button className="btn-primary" onClick={() => { setSearch(''); setSearchParams({}); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid-4">
              {sortedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
