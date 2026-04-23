const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_user_id TEXT,
    telegram_username TEXT,
    total REAL NOT NULL,
    items TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const count = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
if (count === 0) {
  const insert = db.prepare('INSERT INTO products (name, price, description) VALUES (?, ?, ?)');
  const seed = db.transaction(() => {
    insert.run('T-Shirt', 19.99, 'Soft cotton T-shirt');
    insert.run('Coffee Mug', 9.5, 'Ceramic mug, 350ml');
    insert.run('Sticker Pack', 4.0, 'Set of 10 vinyl stickers');
    insert.run('Cap', 14.5, 'Adjustable baseball cap');
  });
  seed();
}

module.exports = db;
