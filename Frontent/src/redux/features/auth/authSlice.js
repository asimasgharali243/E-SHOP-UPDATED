import { createSlice } from '@reduxjs/toolkit';
import { register, login ,logout } from '../../api/authapi/authapi';
import ShowToast from '../../../components/SubComponent/Showtoast';

// ---------- Local Storage Helpers ----------
const AuthUser = 'authUser';

const getStoredUser = () => {
  try {
    const user = localStorage.getItem(AuthUser);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const storeUser = (userData) => {
  try {
    localStorage.setItem(AuthUser, JSON.stringify(userData));
  } catch {}
};

const clearStoredUser = () => {
  try {
    localStorage.removeItem(AuthUser);
  } catch {}
};

// ---------- Redux Slice ----------
const authSlice = createSlice({
  name: 'authUser',
  initialState: {
    user: getStoredUser(),
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder

      // ------ REGISTER ------
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        const userData = action.payload.data;
        state.user = userData.user;
        state.status = 'succeeded';
        storeUser(userData);
        ShowToast('success', userData.message || 'Registered successfully', 'top-right');
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        ShowToast('error', action.payload.message || 'Registration failed', 'top-right');
      })

      // ------ LOGIN ------
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("testing"+action.payload)
        const userData = action.payload.data.user;
        state.user = userData;
        state.status = 'succeeded';
        storeUser(userData);
        ShowToast('success', action.payload.data.message || 'Login successful', 'top-right');
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        ShowToast('error', action.payload.message || 'Login failed', 'top-right');
      })

      /* ------ LOGOUT ------ */
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
        clearStoredUser();
        ShowToast('success', 'Logout successful', 'top-right');
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        ShowToast('error', action.payload.message || 'Logout failed', 'top-right');
      });
      
      
  },
});

// ---------- Exports ----------

export default authSlice.reducer;
