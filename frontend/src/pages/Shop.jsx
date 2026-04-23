import React, { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useCart } from '../cart.jsx';
import { initTelegram, getTelegramUser } from '../telegram.js';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [placed, setPlaced] = useState(null);
  const { items, add, remove, setQuantity, clear, total } = useCart();

  useEffect(() => {
    initTelegram();
    setUser(getTelegramUser());
    api
      .listProducts()
      .then(setProducts)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  }, []);

  const checkout = async () => {
    setError('');
    try {
      const order = await api.createOrder({
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        user,
      });
      setPlaced(order);
      clear();
    } catch (e) {
      setError(String(e.message || e));
    }
  };

  return (
    <div className="grid">
      <section className="card">
        <h2>Products</h2>
        {loading && <p>Loading…</p>}
        {error && <p className="error">{error}</p>}
        <ul className="products">
          {products.map((p) => (
            <li key={p.id} className="product">
              <div>
                <div className="product-name">{p.name}</div>
                {p.description && <div className="product-desc">{p.description}</div>}
                <div className="product-price">${Number(p.price).toFixed(2)}</div>
              </div>
              <button onClick={() => add(p)}>Add to cart</button>
            </li>
          ))}
          {!loading && products.length === 0 && <li>No products yet.</li>}
        </ul>
      </section>

      <section className="card">
        <h2>Cart</h2>
        {items.length === 0 && <p>Cart is empty.</p>}
        <ul className="cart">
          {items.map((i) => (
            <li key={i.id} className="cart-item">
              <span className="cart-name">{i.name}</span>
              <span>
                <button onClick={() => setQuantity(i.id, i.quantity - 1)}>-</button>
                <span className="qty">{i.quantity}</span>
                <button onClick={() => setQuantity(i.id, i.quantity + 1)}>+</button>
              </span>
              <span className="cart-price">${(i.price * i.quantity).toFixed(2)}</span>
              <button className="link" onClick={() => remove(i.id)}>remove</button>
            </li>
          ))}
        </ul>
        <div className="total">Total: ${total.toFixed(2)}</div>
        <button
          className="primary"
          disabled={items.length === 0}
          onClick={checkout}
        >
          Checkout
        </button>
        {placed && (
          <p className="success">
            Order #{placed.id} placed. Total ${placed.total.toFixed(2)}.
          </p>
        )}
      </section>

      <section className="card">
        <h2>Telegram user</h2>
        {user ? (
          <ul className="user-info">
            <li><b>ID:</b> {user.id}</li>
            {user.username && <li><b>Username:</b> @{user.username}</li>}
            {user.first_name && <li><b>Name:</b> {user.first_name} {user.last_name || ''}</li>}
            {user.language_code && <li><b>Lang:</b> {user.language_code}</li>}
          </ul>
        ) : (
          <p>Open this app inside Telegram to see user info.</p>
        )}
      </section>
    </div>
  );
}
