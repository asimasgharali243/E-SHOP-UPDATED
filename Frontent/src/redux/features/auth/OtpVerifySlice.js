import { createSlice } from '@reduxjs/toolkit';
import { VerifyOtpApi } from '../../api/authapi/VerifyOtp';
import ShowToast from '../../../components/SubComponent/Showtoast';

const otpVerifySlice = createSlice({
  name: 'OtpVerify',
  initialState: {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(VerifyOtpApi.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(VerifyOtpApi.fulfilled, (state, action) => {
        state.status = 'succeeded';
        ShowToast('success', action.payload?.data?.message || 'OTP verified successfully', 'top-right');
      })
      .addCase(VerifyOtpApi.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.payload.message)
        ShowToast('error', action.payload.message || 'Network error', 'top-right');
      });
  },
});

export default otpVerifySlice.reducer;
