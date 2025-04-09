import apis from '../../../utils/apis'
import { createSlice} from '@reduxjs/toolkit';
import { forgetPassword } from '../../api/authapi/ForgetPassword';
import ShowToast from '../../../components/SubComponent/Showtoast'; 
const ForgetPasswordSlice = createSlice({
  name: 'ForgetPassword',
  initialState: {timer:0,isOtpSend:false, loading: false, error: null },
  reducers: {
    
      OtpSendState: (state,action) => {
        return { ...state, isOtpSend: action.payload };
      },
      resetTime: (state) => {
        state.timer=0;
      }
      
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgetPassword.pending, (state) => { state.loading = true; })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isOtpSend=true;
        state.timer=action.payload.data.timer;
        ShowToast('success', "Otp send successfully", 'top-right');
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.isOtpSend=true;
        state.error = action.payload.message;
        state.timer=action.payload.timer;
        ShowToast('error', `${action.payload.message || 'Network error'}`, 'top-right');
      })
      
  },
});
export const { OtpSendState,resetTime } = ForgetPasswordSlice.actions;
export default ForgetPasswordSlice.reducer;
