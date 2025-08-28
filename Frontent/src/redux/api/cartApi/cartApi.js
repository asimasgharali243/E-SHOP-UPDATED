import { createAsyncThunk } from "@reduxjs/toolkit";
import apis from "../../../utils/apis";

// --- Fetch Cart ---
export const fetchCartAPI = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${apis().baseUrl}${apis().getCart}`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch cart");
    return data;
  } catch (err) {
    return rejectWithValue(err.message || "Failed to fetch cart");
  }
});

// --- Update/Add Cart Item ---
export const updateCartItemAPI = createAsyncThunk(
  "cart/updateItem",
  async ({ productId, quantity, action = "set" }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apis().baseUrl}${apis().updateCartItem(productId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update cart item");
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update cart item");
    }
  }
);

// --- Remove Cart Item ---
export const removeCartItemAPI = createAsyncThunk(
  "cart/removeItem",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apis().baseUrl}${apis().removeCartItem(productId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove cart item");
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to remove cart item");
    }
  }
);

// --- Clear Cart ---
export const clearCartAPI = createAsyncThunk("cart/clear", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${apis().baseUrl}${apis().clearCart}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to clear cart");
    return data;
  } catch (err) {
    return rejectWithValue(err.message || "Failed to clear cart");
  }
});

// --- Sync Cart ---
export const syncCartAPI = createAsyncThunk(
  "cart/sync",
  async ({ items, version }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apis().baseUrl}${apis().syncCart}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items, version }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to sync cart");
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to sync cart");
    }
  }
);
