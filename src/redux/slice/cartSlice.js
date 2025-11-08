import { createSlice } from "@reduxjs/toolkit";

const ensureCartId = () => {
  let id = localStorage.getItem("cartId");
  if (!id) {
    id = "cart_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("cartId", id);
  }
  return id;
};

const apiFetch = async (url, options = {}) => {
  const cartId = ensureCartId();
  const headers = {
    "Content-Type": "application/json",
    "x-cart-id": cartId,
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Request failed");
  return res.json();
};

// Thunks
export const fetchCart = () => async (dispatch) => {
  dispatch(setStatus("loading"));
  try {
    const data = await apiFetch("/api/cart");
    dispatch(setCart(data));
    dispatch(setStatus("idle"));
  } catch (e) {
    dispatch(setStatus("error"));
  }
};

export const addToCart = (productId, qty = 1) => async (dispatch) => {
  dispatch(setStatus("loading"));
  try {
    const data = await apiFetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, qty })
    });
    dispatch(setCart(data));
    dispatch(setStatus("idle"));
  } catch (e) {
    dispatch(setStatus("error"));
  }
};

export const updateQty = (productId, qty) => async (dispatch) => {
  dispatch(setStatus("loading"));
  try {
    const data = await apiFetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, qty })
    });
    dispatch(setCart(data));
    dispatch(setStatus("idle"));
  } catch (e) {
    dispatch(setStatus("error"));
  }
};

export const removeFromCart = (productId) => async (dispatch) => {
  dispatch(setStatus("loading"));
  try {
    const data = await apiFetch(`/api/cart/${productId}`, { method: "DELETE" });
    dispatch(setCart(data));
    dispatch(setStatus("idle"));
  } catch (e) {
    dispatch(setStatus("error"));
  }
};

export const checkout = (name, email) => async (dispatch) => {
  dispatch(setStatus("loading"));
  try {
    const data = await apiFetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ name, email })
    });
    // clear cart after checkout
    dispatch(setCart({ items: [], total: 0 }));
    dispatch(setStatus("idle"));
    return data.receipt;
  } catch (e) {
    dispatch(setStatus("error"));
    throw e;
  }
};

const initialState = {
  items: [],
  total: 0,
  status: "idle",
};

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.total = action.payload.total || 0;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setCart, setStatus } = CartSlice.actions;
export default CartSlice.reducer;