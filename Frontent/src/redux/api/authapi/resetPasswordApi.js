import {createAsyncThunk } from '@reduxjs/toolkit';
import apis from '../../../utils/apis';

export const  resetPasswordApi = createAsyncThunk('Reset/Password', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${apis().baseUrl}${apis().resetPassword}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    if (!response.ok) {
      // Handle HTTP errors
      const error = await response.json();
      console.error(' Reset Password error:', error);
      return rejectWithValue(error);
    }

    // Parse the successful response
    const res = await response.json();
    console.log('Reset Password successful:', res);
    return { data: res };
  } catch (e) {
    // Handle network or parsing errors
    console.error('Reset password catch error:', e);
    return rejectWithValue(e || 'Network error');
  }
});