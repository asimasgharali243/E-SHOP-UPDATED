import {createAsyncThunk } from '@reduxjs/toolkit';
import apis from '../../../utils/apis';

export const  VerifyOtpApi = createAsyncThunk('Otp/Verify', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${apis().baseUrl}${apis().otpVerify}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      // Handle HTTP errors
      const error = await response.json();
      console.error(' Otp Verify error:', error);
      return rejectWithValue(error);
    }

    // Parse the successful response
    const res = await response.json();
    console.log('Otp Verify successful:', res);
    return { data: res };
  } catch (e) {
    // Handle network or parsing errors
    console.error('Otp verify catch error:', e);
    return rejectWithValue(e);
  }
});

