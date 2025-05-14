import { createSlice } from '@reduxjs/toolkit';
import { forgetPassword } from '../../api/authapi/ForgetPassword';
import ShowToast from '../../../components/SubComponent/Showtoast';

const ForgetPasswordSlice = createSlice({
  name: 'ForgetPassword',
  initialState: {
    timer: 0,
    loading: false,
  },
  reducers: {
    resetTime: (state) => {
      state.timer = 0;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(forgetPassword.pending, (state, action) => {
      state.loading = true;
    })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.timer = action.payload.data.timer || 0;
        state.loading = false;
        
        ShowToast('success', action.payload.data.message || 'OTP sent successfully', 'top-right');
        
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.timer = action.payload.timer || 0;
        
        state.loading = false;
        console.log(action.payload.message);
        ShowToast('error', action.payload.message || 'Failed to send OTP', 'top-right');
      });
  },
});

export const { resetTime } = ForgetPasswordSlice.actions;
export default ForgetPasswordSlice.reducer;
