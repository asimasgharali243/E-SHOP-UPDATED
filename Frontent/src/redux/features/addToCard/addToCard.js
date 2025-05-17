import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const CART_KEY = 'eshop_cart';

const saveCartToLocalStorage = (cartState) => {
  try {
    const serialized = JSON.stringify(cartState);
    localStorage.setItem(CART_KEY, serialized);
  } catch (err) {
    console.error('Save Cart Error:', err);
  }
};

const loadCartFromLocalStorage = () => {
  try {
    const serialized = localStorage.getItem(CART_KEY);
    return serialized ? JSON.parse(serialized) : undefined;
  } catch (err) {
    console.error('Load Cart Error:', err);
    return undefined;
  }
};

const syncCartAPI = async (cartItems) => {
  const response = await fetch('https://yourapi.com/api/cart/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems }),
  });

  if (!response.ok) {
    throw new Error('Failed to sync cart');
  }

  const data = await response.json();
  return data.cartItems;
};

export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (cartItems, thunkAPI) => {
    try {
      return await syncCartAPI(cartItems);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = loadCartFromLocalStorage() || {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.cartItems.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToLocalStorage(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToLocalStorage(state);
    },

    increaseQuantity: (state, action) => {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToLocalStorage(state);
    },

    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) item.quantity -= 1;
        else state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
      }
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToLocalStorage(state);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      saveCartToLocalStorage(state);
    },

    calculateTotals: (state) => {
      let totalQty = 0;
      let totalPrice = 0;
      state.cartItems.forEach((item) => {
        totalQty += item.quantity;
        totalPrice += item.quantity * item.price;
      });
      state.totalQuantity = totalQty;
      state.totalPrice = totalPrice;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(syncCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cartItems = action.payload;
        cartSlice.caseReducers.calculateTotals(state);
        saveCartToLocalStorage(state);
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// -------------------
// Exports
// -------------------
export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
