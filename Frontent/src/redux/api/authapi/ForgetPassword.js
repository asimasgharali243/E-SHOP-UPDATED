import {createAsyncThunk } from '@reduxjs/toolkit';
import apis from '../../../utils/apis';

export const  forgetPassword = createAsyncThunk('Forget/Password', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(apis().forgetPassword,{
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
      console.error(' Forget Password error:', error);
      return rejectWithValue(error);
    }

    // Parse the successful response
    const res = await response.json();
    console.log('Otp send successful:', res);
    return { data: res };
  } catch (e) {
    // Handle network or parsing errors
    console.error('Forget password catch error:', e);
    return rejectWithValue(e);
  }
});

