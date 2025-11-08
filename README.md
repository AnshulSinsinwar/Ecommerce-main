# Mock E‑Com Cart (React + Express + MongoDB)

Basic full‑stack shopping cart for screening:

- React (Vite) frontend, Redux for state
- Express backend, MongoDB (Mongoose)
- REST APIs: products, cart, checkout

## Features

- Products grid with Add/Remove to cart
- Cart view with quantities and computed total
- Checkout form (name/email) → mock receipt modal
- Per‑user cart via `x-cart-id` stored in localStorage

## Monorepo structure

- `/` → React app (Vite)
- `/backend` → Express API + MongoDB models

## Prerequisites

- Node.js 18+
- A MongoDB URI (Atlas or local)

## Setup

1) Backend

- Create `backend/.env`:

```
MONGO_URI=your_mongodb_uri
PORT=5000
```

- Install deps and seed products:

```
cd backend
npm install
npm run seed
npm run dev
```

2) Frontend

- From project root:

```
npm install
npm run dev
```

- Open the Vite URL (e.g., http://localhost:5173). The dev proxy forwards `/api` to `http://localhost:5000`.

## API Overview

- `GET /api/products` → list products
- `GET /api/cart` → `{ items, total }` (requires `x-cart-id` header; injected automatically by frontend)
- `POST /api/cart` → `{ productId, qty }` (add/update; `qty <= 0` removes)
- `DELETE /api/cart/:id` → remove product from cart
- `POST /api/checkout` → `{ name, email }` → `{ receipt }` and clears cart

## Running on a live server

You can deploy the backend and frontend separately.

- Backend (Render/OnRender)
  - Push repo to GitHub
  - Create a new Web Service on Render
  - Root directory: `backend`
  - Build command: `npm install`
  - Start command: `node src/index.js`
  - Add env var: `MONGO_URI`
  - Get the live URL, e.g., `https://your-backend.onrender.com`

- Frontend (Netlify/Vercel)
  - Create site from Git repo
  - Build command: `npm run build`
  - Publish directory: `dist`
  - For Netlify, add `public/_redirects` to proxy API:

```
/api/* https://your-backend.onrender.com/api/:splat 200
```

  - Alternatively, set an environment variable `VITE_API_BASE` and update fetches to use it for production.

## Scripts

Frontend

- `npm run dev` → Vite dev server
- `npm run build` → production build
- `npm run preview` → preview build

Backend

- `npm run dev` → nodemon server
- `npm run seed` → seed products
- `npm start` → start server

## Notes

- Cart is scoped per browser via `localStorage.cartId`
- `.env` is gitignored; don’t commit secrets
