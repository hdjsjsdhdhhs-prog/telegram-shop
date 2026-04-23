const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/products', (_req, res) => {
  const rows = db.prepare('SELECT id, name, price, description FROM products ORDER BY id DESC').all();
  res.json(rows);
});

app.post('/products', (req, res) => {
  const { name, price, description } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }
  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum < 0) {
    return res.status(400).json({ error: 'price must be a non-negative number' });
  }
  const info = db
    .prepare('INSERT INTO products (name, price, description) VALUES (?, ?, ?)')
    .run(name.trim(), priceNum, (description || '').toString());
  const product = db
    .prepare('SELECT id, name, price, description FROM products WHERE id = ?')
    .get(info.lastInsertRowid);
  res.status(201).json(product);
});

app.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'invalid id' });
  }
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'product not found' });
  }
  res.json({ ok: true });
});

app.post('/orders', (req, res) => {
  const { items, user } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' });
  }

  const ids = items.map((i) => Number(i.id)).filter((n) => Number.isInteger(n));
  if (ids.length !== items.length) {
    return res.status(400).json({ error: 'each item must have a numeric id' });
  }

  const placeholders = ids.map(() => '?').join(',');
  const products = db
    .prepare(`SELECT id, name, price FROM products WHERE id IN (${placeholders})`)
    .all(...ids);
  const priceById = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  const normalized = [];
  for (const item of items) {
    const p = priceById.get(Number(item.id));
    if (!p) {
      return res.status(400).json({ error: `product ${item.id} not found` });
    }
    const qty = Math.max(1, Number(item.quantity) || 1);
    total += p.price * qty;
    normalized.push({ id: p.id, name: p.name, price: p.price, quantity: qty });
  }

  const info = db
    .prepare(
      'INSERT INTO orders (telegram_user_id, telegram_username, total, items) VALUES (?, ?, ?, ?)'
    )
    .run(
      user?.id ? String(user.id) : null,
      user?.username || null,
      Number(total.toFixed(2)),
      JSON.stringify(normalized)
    );

  res.status(201).json({
    id: info.lastInsertRowid,
    total: Number(total.toFixed(2)),
    items: normalized,
  });
});

app.get('/orders', (_req, res) => {
  const rows = db
    .prepare('SELECT id, telegram_user_id, telegram_username, total, items, created_at FROM orders ORDER BY id DESC')
    .all()
    .map((r) => ({ ...r, items: JSON.parse(r.items) }));
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
