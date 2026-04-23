import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .listProducts()
      .then(setProducts)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.createProduct({
        name,
        price: Number(price),
        description,
      });
      setName('');
      setPrice('');
      setDescription('');
      load();
    } catch (err) {
      setError(String(err.message || err));
    }
  };

  const del = async (id) => {
    setError('');
    try {
      await api.deleteProduct(id);
      load();
    } catch (err) {
      setError(String(err.message || err));
    }
  };

  return (
    <div className="grid">
      <section className="card">
        <h2>Create product</h2>
        <form onSubmit={submit} className="form">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Price
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <button className="primary" type="submit">Create</button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <h2>Products</h2>
        {loading && <p>Loading…</p>}
        <ul className="products">
          {products.map((p) => (
            <li key={p.id} className="product">
              <div>
                <div className="product-name">{p.name}</div>
                {p.description && <div className="product-desc">{p.description}</div>}
                <div className="product-price">${Number(p.price).toFixed(2)}</div>
              </div>
              <button onClick={() => del(p.id)}>Delete</button>
            </li>
          ))}
          {!loading && products.length === 0 && <li>No products yet.</li>}
        </ul>
      </section>
    </div>
  );
}
