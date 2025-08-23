import { createAsyncThunk } from '@reduxjs/toolkit';
import apis from '../../../utils/apis';

export const forgetPassword = createAsyncThunk(
  'Forget/Password',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${apis().baseUrl}${apis().forgetPassword}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
          credentials: 'include', // keep only if backend supports it
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data); // send error object to slice
      }

      return { data };
    } catch (err) {
      return rejectWithValue({ message: err.message || 'Network error' });
    }
  }
);
