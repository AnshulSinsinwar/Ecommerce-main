# E-Commerce Application (React + Express + MongoDB)

A modern full-stack e-commerce shopping cart application with a clean UI and robust backend:

- **Frontend**: React 19 (Vite), Redux Toolkit for state management, TailwindCSS 4 for styling
- **Backend**: Express.js with MongoDB (Mongoose)
- **Features**: Product browsing, cart management, checkout flow with toast notifications

## Features

- 🛍️ Products grid with Add/Remove to cart functionality
- 🛒 Cart view with quantity management and real-time total calculation
- 💳 Checkout form (name/email) with mock receipt modal
- 🔄 Per-user cart persistence via `x-cart-id` stored in localStorage
- 🎨 Modern UI with TailwindCSS and React Icons
- 🔥 Hot toast notifications for user feedback
- 🚀 React Router for seamless navigation

## Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **Vite 6** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **TailwindCSS 4** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Project Structure

```
Ecommerce-main/
├── src/                    # Frontend source
│   ├── component/          # Reusable React components
│   ├── pages/              # Page components
│   ├── redux/              # Redux store and slices
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── backend/                # Backend source
│   └── src/
│       ├── models/         # Mongoose models (Product, Cart)
│       ├── routes/         # API route handlers
│       ├── index.js        # Express server
│       └── seed.js         # Database seeding script
├── public/                 # Static assets
└── vite.config.js          # Vite configuration
```

## Prerequisites

- Node.js 18+
- MongoDB URI (MongoDB Atlas or local instance)

## Setup & Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Ecommerce-main
```

### 2. Backend Setup

Navigate to the backend directory and set up environment variables:

```bash
cd backend
```

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

**Note**: Replace `your_mongodb_connection_string` with your actual MongoDB URI from MongoDB Atlas or your local MongoDB instance.

Install dependencies and seed the database:

```bash
npm install
npm run seed
npm run dev
```

The backend server will start on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal and navigate to the project root:

```bash
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or another available port).

**Note**: The Vite dev server automatically proxies `/api` requests to `http://localhost:5000` (configured in `vite.config.js`).

## API Endpoints

### Products
- **GET** `/api/products` - Retrieve all products
  - Response: Array of product objects

### Cart
- **GET** `/api/cart` - Get current cart
  - Headers: `x-cart-id` (automatically injected by frontend)
  - Response: `{ items: [], total: Number }`

- **POST** `/api/cart` - Add/update item in cart
  - Body: `{ productId: String, qty: Number }`
  - Note: Setting `qty <= 0` removes the item

- **DELETE** `/api/cart/:id` - Remove specific product from cart
  - Params: `id` (product ID)

### Checkout
- **POST** `/api/checkout` - Process checkout
  - Body: `{ name: String, email: String }`
  - Response: `{ receipt: Object }`
  - Note: Clears the cart after successful checkout

### Health Check
- **GET** `/api/health` - Server health check
  - Response: `{ ok: true }`

## Deployment

### Backend Deployment (Render/Railway/Heroku)

**Example using Render:**

1. Push your repository to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
4. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: 5000 (optional, defaults to 5000)
5. Deploy and note your backend URL (e.g., `https://your-app.onrender.com`)

### Frontend Deployment (Netlify/Vercel)

**Example using Netlify:**

1. Create a new site from your Git repository
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Update `public/_redirects` with your backend URL:
   ```
   /api/* https://your-backend.onrender.com/api/:splat 200
   ```
4. Deploy the site

**Alternative**: Set environment variable `VITE_API_BASE` with your backend URL and update API calls to use it in production.

## Available Scripts

### Frontend (Root Directory)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Build production-ready bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### Backend (`/backend` Directory)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon (auto-restart) |
| `npm start` | Start production server |
| `npm run seed` | Seed database with sample products |

## Database Schema

### Product Model
```javascript
{
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
  stock: Number
}
```

### Cart Model
```javascript
{
  cartId: String,        // Unique cart identifier
  items: [{
    product: ObjectId,   // Reference to Product
    quantity: Number
  }],
  total: Number
}
```

## Key Features Explained

### Cart Persistence
- Each user gets a unique `cartId` stored in `localStorage`
- The `x-cart-id` header is automatically sent with every API request
- Cart data persists across browser sessions

### State Management
- Redux Toolkit manages global state (cart items, products)
- Async thunks handle API calls
- Optimistic UI updates for better UX

### Styling
- TailwindCSS 4 with modern utility classes
- Responsive design for mobile and desktop
- Custom components with consistent styling

## Important Notes

- 🔒 **Security**: `.env` files are gitignored - never commit secrets
- 🗄️ **Database**: MongoDB database name is set to `vibe_commerce`
- 🔑 **Cart ID**: Unique cart per browser via `localStorage.cartId`
- 🌐 **CORS**: Enabled for cross-origin requests in development
- 🔄 **Proxy**: Vite dev server proxies `/api` to backend automatically

## Troubleshooting

### Backend won't start
- Ensure MongoDB URI is correct in `backend/.env`
- Check if MongoDB service is running
- Verify Node.js version (18+)

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check Vite proxy configuration in `vite.config.js`
- Verify no firewall blocking localhost connections

### Database connection issues
- Verify MongoDB Atlas IP whitelist (allow your IP or 0.0.0.0/0)
- Check MongoDB URI format: `mongodb+srv://username:password@cluster.mongodb.net/`
- Ensure network connectivity
