// redux/cart/cartAPI.js
import apis from '../../utils/apis';

export const syncCartAPI = async (cartItems) => {
  const response = await fetch(`${apis().baseUrl}/cart/sync`, {
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
