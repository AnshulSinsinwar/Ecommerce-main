import express from 'express';
import Cart from '../models/Cart.js';

const router = express.Router();

function getCartId(req) {
  return req.header('x-cart-id') || req.query.cartId || req.body.cartId;
}

// POST /api/checkout { name, email }
router.post('/', async (req, res) => {
  try {
    const cartId = getCartId(req);
    const { name, email } = req.body;
    if (!cartId) return res.status(400).json({ message: 'Missing cartId' });
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

    const cart = await Cart.findOne({ cartId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.items.map((it) => ({
      title: it.product?.title,
      price: it.product?.price,
      qty: it.qty,
      subtotal: (it.product?.price || 0) * it.qty
    }));
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    const timestamp = new Date().toISOString();

    // Clear cart after checkout (mock)
    cart.items = [];
    await cart.save();

    res.json({ receipt: { name, email, total, timestamp, items } });
  } catch (e) {
    res.status(500).json({ message: 'Checkout failed' });
  }
});

export default router;
