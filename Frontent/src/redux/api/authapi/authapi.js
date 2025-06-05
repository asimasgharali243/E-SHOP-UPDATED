import { createAsyncThunk } from '@reduxjs/toolkit';
import apis from '../../../utils/apis';

export const register = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(apis().registerUser, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const resdata = await response.json();
      console.log(resdata);
      if (!response.ok) {
        console.error('Register error:', data);
        return rejectWithValue({
          message: resdata.message || 'Registration failed'
        });
      }

      console.log('Register successful:', resdata);
      return resdata;
    } catch (e) {
      console.error('Register catch error:', e);
      return rejectWithValue({
        message: e.message || 'Network error'
      });
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(apis().loginUser, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const resdata = await response.json();
      
      if (!response.ok) {
        console.error('Login error:', resdata);
        return rejectWithValue({
          message: resdata.message || 'Login failed'
        });
      }

      console.log('Login successful:',resdata);
      return resdata;
    } catch (e) {
      console.error('Login catch error:', e);
      return rejectWithValue({
        message: e.message || 'Network error'
      });
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(apis().logoutUser, {
        method: 'POST',
        credentials: 'include',
      });

      const resdata = await response.json();
      
      if (!response.ok) {
        console.error('Logout error:', resdata);
        return rejectWithValue({
          message: data.message || 'Logout failed'
        });
      }

      console.log('Logout successful:', resdata);
      return resdata;
    } catch (e) {
      console.error('Logout catch error:', e);
      return rejectWithValue({
        message: e.message || 'Network error'
      });
    }
  }
);