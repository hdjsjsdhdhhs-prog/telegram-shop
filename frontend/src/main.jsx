import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Shop from './pages/Shop.jsx';
import Admin from './pages/Admin.jsx';
import { CartProvider } from './cart.jsx';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <header className="topbar">
          <Link to="/" className="brand">Telegram Shop</Link>
          <nav>
            <Link to="/">Shop</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </header>
        <main className="container">
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </CartProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
