const API_URL = import.meta.env.VITE_API_URL || 'https://telegram-shop-backend-production.up.railway.app';

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

export const api = {
  listProducts: () => fetch(`${API_URL}/products`).then(handle),
  createProduct: (payload) =>
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handle),
  deleteProduct: (id) =>
    fetch(`${API_URL}/products/${id}`, { method: 'DELETE' }).then(handle),
  createOrder: (payload) =>
    fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handle),
};
