import apis from '../../../utils/apis'
import { createSlice} from '@reduxjs/toolkit';
import { VerifyOtpApi } from '../../api/authapi/VerifyOtp';
import ShowToast from '../../../components/SubComponent/Showtoast'; 
const otpVerifySlice = createSlice({
  name: 'OtpVerify',
  initialState: { isverify:false,loading: false, error: null },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(VerifyOtpApi.pending, (state) => { state.loading = true; })
      .addCase(VerifyOtpApi.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isverify=true;

        ShowToast('success', ` ${action.payload.data.message || 'Otp  verified successfully'}`, 'top-right');
      })
      .addCase(VerifyOtpApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isverify=false;
        ShowToast('error', `${action.payload || 'Network error'}`, 'top-right');
      })
      
  },
});

export default otpVerifySlice.reducer;
