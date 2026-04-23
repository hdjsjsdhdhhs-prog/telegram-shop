# Telegram Mini App Online Shop

A minimal but complete Telegram Mini App online shop.

- **Frontend:** React (Vite) with a `/admin` route and the Telegram WebApp SDK
- **Backend:** Node.js (Express) with SQLite (via `better-sqlite3`)
- **Database:** SQLite file auto-created and seeded on first run

## Project folder tree

```
telegram-shop/
├── README.md
├── backend/
│   ├── .gitignore
│   ├── package.json
│   └── src/
│       ├── db.js
│       └── server.js
└── frontend/
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api.js
        ├── cart.jsx
        ├── main.jsx
        ├── styles.css
        ├── telegram.js
        └── pages/
            ├── Admin.jsx
            └── Shop.jsx
```

## Installation

Requires Node.js 18+ and npm.

```bash
# Backend
cd backend
npm install

# Frontend (in a separate terminal)
cd ../frontend
npm install
cp .env.example .env   # optional, only if you want to override VITE_API_URL
```

## Run

```bash
# Terminal 1 – backend on http://localhost:3001
cd backend
npm start

# Terminal 2 – frontend on http://localhost:5173
cd frontend
npm run dev
```

Open `http://localhost:5173` for the shop and `http://localhost:5173/admin` for the admin panel.

## API

- `GET /products` – list products
- `POST /products` – create product `{ name, price, description? }`
- `DELETE /products/:id` – delete product
- `POST /orders` – create order `{ items: [{ id, quantity }], user? }`
- `GET /orders` – list orders
- `GET /health` – health check

## Telegram integration

The frontend loads the official Telegram WebApp SDK
(`https://telegram.org/js/telegram-web-app.js`) and calls `ready()` and
`expand()` on load. When opened inside Telegram, user info
(`id`, `username`, `first_name`, `last_name`, `language_code`) is read from
`Telegram.WebApp.initDataUnsafe.user` and displayed on the shop page, plus it
is attached to every `POST /orders` request.

To test as a real Mini App, expose the frontend via HTTPS (e.g. with `ngrok`)
and point a Telegram bot's Mini App URL to it via `@BotFather → Bot Settings
→ Menu Button / Mini App`.
