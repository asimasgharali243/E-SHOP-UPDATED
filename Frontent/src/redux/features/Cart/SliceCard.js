import { createSlice } from "@reduxjs/toolkit";
import ShowToast from "../../../components/SubComponent/Showtoast";
import {
  fetchCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
  syncCartAPI,
} from "../../api/cartApi/cartApi";
import { createSelector } from "@reduxjs/toolkit";

const CART_KEY = "userCart";

// Load cart from localStorage
export const loadCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : { items: [], version: 0, lastSync: null };
  } catch {
    return { items: [], version: 0, lastSync: null };
  }
};

// Save cart to localStorage
const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {}
};

const clearStoredCart = () => {
  localStorage.removeItem(CART_KEY);
};

const initialState = {
  ...loadCart(),
  status: "idle",
  updateStatus: "idle",
  removeStatus: "idle",
  clearStatus: "idle",
  syncStatus: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Always flatten product into productId + meta
    addToCartLocal: (state, { payload }) => {
      const { product, quantity = 1 } = payload;
      const existing = state.items.find((i) => i.productId === product._id);

      if (existing) {
        existing.quantity += quantity;
        ShowToast(
          "success",
          `Increased ${product.name} quantity to ${existing.quantity}`,
          "top-right"
        );
      } else {
        state.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image || product.images?.[0] || "",
          quantity,
        });
        ShowToast("success", `${product.name} added to cart`, "top-right");
      }

      saveCart(state);
    },

    updateQuantityLocal: (state, { payload }) => {
      const { productId, quantity } = payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
      saveCart(state);
    },

    removeFromCartLocal: (state, { payload }) => {
      state.items = state.items.filter((i) => i.productId !== payload);
      saveCart(state);
    },

    clearLocalCart: (state) => {
      state.items = [];
      state.version = 0;
      state.lastSync = null;
      clearStoredCart();
    },

    updateCartFromServer: (state, { payload }) => {
      state.items = payload.items;
      state.version = payload.version;
      state.lastSync = new Date().toISOString();
      saveCart(state);
    },
  },

  extraReducers: (builder) => {
    builder
      // 🔹 Fetch cart
      .addCase(fetchCartAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartAPI.fulfilled, (state, { payload }) => {
        state.items = payload.items;
        state.version = payload.version;
        state.lastSync = new Date().toISOString();
        state.status = "idle";
        saveCart(state);
      })
      .addCase(fetchCartAPI.rejected, (state, { payload }) => {
        state.error = payload || "Failed to fetch cart";
        state.status = "idle";

        // ✅ Fallback: use local storage
        const local = loadCart();
        state.items = local.items || [];
        state.version = local.version || 0;
        state.lastSync = local.lastSync || null;

        ShowToast(
          "warning",
          "Server cart unavailable, using local cart",
          "top-right"
        );
      })

      // 🔹 Update item
      .addCase(updateCartItemAPI.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateCartItemAPI.fulfilled, (state, { payload }) => {
        state.items = payload.items;
        state.version = payload.version;
        state.lastSync = new Date().toISOString();
        state.updateStatus = "idle";
        saveCart(state);
      })
      .addCase(updateCartItemAPI.rejected, (state, { payload }) => {
        state.error = payload || "Failed to update cart item";
        state.updateStatus = "idle";
        ShowToast("error", state.error, "top-right");
      })

      // 🔹 Remove item
      .addCase(removeCartItemAPI.pending, (state) => {
        state.removeStatus = "loading";
      })
      .addCase(removeCartItemAPI.fulfilled, (state, { payload }) => {
        state.items = payload.items;
        state.version = payload.version;
        state.lastSync = new Date().toISOString();
        state.removeStatus = "idle";
        saveCart(state);
      })
      .addCase(removeCartItemAPI.rejected, (state, { payload }) => {
        state.error = payload || "Failed to remove cart item";
        state.removeStatus = "idle";
        ShowToast("error", state.error, "top-right");
      })

      // 🔹 Clear cart
      .addCase(clearCartAPI.pending, (state) => {
        state.clearStatus = "loading";
      })
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.items = [];
        state.version = 0;
        state.lastSync = new Date().toISOString();
        state.clearStatus = "idle";
        clearStoredCart();
        ShowToast("success", "Cart cleared", "top-right");
      })
      .addCase(clearCartAPI.rejected, (state, { payload }) => {
        state.error = payload || "Failed to clear cart";
        state.clearStatus = "idle";
        ShowToast("error", state.error, "top-right");
      })

      // 🔹 Sync cart
      .addCase(syncCartAPI.pending, (state) => {
        state.syncStatus = "loading";
      })
      .addCase(syncCartAPI.fulfilled, (state, { payload }) => {
        state.items = payload.items;
        state.version = payload.version;
        state.lastSync = new Date().toISOString();
        state.syncStatus = "idle";
        saveCart(state);
        ShowToast("success", "Cart synced successfully", "top-right");
      })
      .addCase(syncCartAPI.rejected, (state, { payload }) => {
        state.error = payload || "Failed to sync cart";
        state.syncStatus = "idle";
        ShowToast("error", state.error, "top-right");
      });
  },
});

// ✅ Actions
export const {
  addToCartLocal,
  updateQuantityLocal,
  removeFromCartLocal,
  clearLocalCart,
  updateCartFromServer,
} = cartSlice.actions;

// ✅ Selectors
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  )
);

export const selectCartQuantity = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + (item.quantity || 0), 0)
);

export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;
export const selectCartVersion = (state) => state.cart.version;
export const selectSyncStatus = (state) => state.cart.syncStatus;

export default cartSlice.reducer;
