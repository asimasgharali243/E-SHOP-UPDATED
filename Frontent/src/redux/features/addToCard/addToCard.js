// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [], // { id, title, price, quantity }
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== id);

      cartSlice.caseReducers.calculateTotals(state);
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.cartItems.find(item => item.id === id);
      if (item) {
        item.quantity += 1;
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.cartItems.find(item => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        state.cartItems = state.cartItems.filter(item => item.id !== id);
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },

    calculateTotals: (state) => {
      let quantity = 0;
      let price = 0;

      state.cartItems.forEach(item => {
        quantity += item.quantity;
        price += item.price * item.quantity;
      });

      state.totalQuantity = quantity;
      state.totalPrice = price;
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
