import {createAsyncThunk } from '@reduxjs/toolkit';
import apis from '../../../utils/apis';

export const register = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(apis().registerUser, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    if (!response.ok) {
      // Handle HTTP errors
     const  error = await response.json();
     // const error = `Error ${response.status}: ${response.statusText}`;
      console.error('Register error:', error);
      return rejectWithValue(error.message);
    }

    // Parse the successful response
    const res = await response.json();
    console.log('Register successful:', res);
    return { data: res };
  } catch (e) {
    // Handle network or parsing errors
    console.error('Register catch error:', e);
    return rejectWithValue(e.message || 'Network error');
  }
});

    
export const login = createAsyncThunk('user/login', async (userData, { rejectWithValue }) => {
  try {
    console.log(apis().loginUser);
    const response = await fetch(apis().loginUser, { // Ensure `apis().loginUser` points to the correct endpoint
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
      //const error = `Error ${response.status}: ${response.statusText}`;
      console.error('Login error:', error);
      return rejectWithValue(error.message);
    }

    // Parse the successful response
    const res = await response.json();
    console.log('Login successful:', res);
    return { data: res };
  } catch (e) {
    // Handle network or parsing errors
    console.error('Login catch error:', e);
    return rejectWithValue(e.message || 'Network error');
  }
});
