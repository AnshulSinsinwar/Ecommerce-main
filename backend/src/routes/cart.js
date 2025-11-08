import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

function getCartId(req) {
  return req.header('x-cart-id') || req.query.cartId || req.body.cartId;
}

async function loadOrCreateCart(cartId) {
  let cart = await Cart.findOne({ cartId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ cartId, items: [] });
    cart = await Cart.findOne({ cartId }).populate('items.product');
  }
  return cart;
}

// GET /api/cart -> { items, total }
router.get('/', async (req, res) => {
  try {
    const cartId = getCartId(req);
    if (!cartId) return res.status(400).json({ message: 'Missing cartId' });
    const cart = await loadOrCreateCart(cartId);
    const total = cart.items.reduce((sum, it) => sum + it.qty * (it.product?.price || 0), 0);
    res.json({
      items: cart.items.map((it) => ({
        product: it.product,
        productId: it.product?._id,
        qty: it.qty,
        lineTotal: (it.product?.price || 0) * it.qty
      })),
      total
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to get cart' });
  }
});

// POST /api/cart { productId, qty }
router.post('/', async (req, res) => {
  try {
    const cartId = getCartId(req);
    const { productId, qty = 1 } = req.body;
    if (!cartId || !productId) return res.status(400).json({ message: 'Missing cartId or productId' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await loadOrCreateCart(cartId);
    const idx = cart.items.findIndex((it) => String(it.product) === String(productId) || String(it.product?._id) === String(productId));

    if (qty <= 0) {
      if (idx >= 0) cart.items.splice(idx, 1);
    } else if (idx >= 0) {
      cart.items[idx].qty = qty;
    } else {
      cart.items.push({ product: product._id, qty });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    const total = populated.items.reduce((sum, it) => sum + it.qty * (it.product?.price || 0), 0);
    res.json({
      items: populated.items.map((it) => ({
        product: it.product,
        productId: it.product?._id,
        qty: it.qty,
        lineTotal: (it.product?.price || 0) * it.qty
      })),
      total
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

// DELETE /api/cart/:id -> remove product from cart
router.delete('/:id', async (req, res) => {
  try {
    const cartId = getCartId(req);
    const { id: productId } = req.params;
    if (!cartId || !productId) return res.status(400).json({ message: 'Missing cartId or productId' });

    const cart = await loadOrCreateCart(cartId);
    const idx = cart.items.findIndex((it) => String(it.product) === String(productId) || String(it.product?._id) === String(productId));
    if (idx >= 0) {
      cart.items.splice(idx, 1);
      await cart.save();
    }
    const populated = await Cart.findById(cart._id).populate('items.product');
    const total = populated.items.reduce((sum, it) => sum + it.qty * (it.product?.price || 0), 0);
    res.json({
      items: populated.items.map((it) => ({
        product: it.product,
        productId: it.product?._id,
        qty: it.qty,
        lineTotal: (it.product?.price || 0) * it.qty
      })),
      total
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to remove item' });
  }
});

export default router;
