import { addToCartLocal, updateQuantityLocal, removeFromCartLocal } from './SliceCard';
import { syncCartAPI } from '../../api/cartApi/cartApi';

let syncTimeout;
const debounceSync = (dispatch, getState) => {
  clearTimeout(syncTimeout);
//   console.log("Debounce sync triggered", getState().cart);
  syncTimeout = setTimeout(() => {
    const { items, version } = getState().cart;
    console.log("Syncing cart:", { items, version });
    dispatch(syncCartAPI({ items, version }));
  }, 1000);
};

export const addToCart = (product, quantity = 1) => (dispatch, getState) => {
  dispatch(addToCartLocal({ product, quantity }));
  debounceSync(dispatch, getState);

};

export const updateCartQuantity = (productId, quantity) => (dispatch, getState) => {
  dispatch(updateQuantityLocal({ productId, quantity }));
  debounceSync(dispatch, getState);
};

export const increaseQuantity = (productId) => (dispatch, getState) => {
  const state = getState();
  const item = state.cart.items.find(i => i.productId === productId);
  if (item) {
    dispatch(updateQuantityLocal({ productId, quantity: item.quantity + 1 }));
    debounceSync(dispatch, getState);
  }
};

export const decreaseQuantity = (productId) => (dispatch, getState) => {
  const state = getState();
  const item = state.cart.items.find(i => i.productId === productId);
  if (item) {
    if (item.quantity > 1) {
      dispatch(updateQuantityLocal({ productId, quantity: item.quantity - 1 }));
      debounceSync(dispatch, getState);
    } else {
      removeFromCart(productId)(dispatch, getState);
    }
  }
};

export const removeFromCart = (productId) => (dispatch, getState) => {
  dispatch(removeFromCartLocal(productId));
  debounceSync(dispatch, getState);
};

export const forceSyncCart = () => (dispatch, getState) => {
  const { items, version } = getState().cart;
  dispatch(syncCartAPI({ items, version }));
};
