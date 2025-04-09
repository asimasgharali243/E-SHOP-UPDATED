import apis from '../../../utils/apis'
import { createSlice} from '@reduxjs/toolkit';
import { register, login } from '../../api/authapi/authapi';
import ShowToast from '../../../components/SubComponent/Showtoast'; 
const authSlice = createSlice({
  name: 'authUser',
  initialState: { user: null, loading: false, error: null ,islogin:false},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.islogin=true;
        state.error = null;
        ShowToast('success', 'Registration successfully', 'top-right');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.islogin=false;
        state.error = action.payload;
        ShowToast('error', `${action.payload}`, 'top-right');
      })
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.islogin=true;
        state.error = null;
        state.user = action.payload.data;
        ShowToast('success', 'Login successfully', 'top-right');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.islogin=false;
        state.error = action.payload;
        ShowToast('error', `${action.payload}`, 'top-right');
      });
  },
});

export default authSlice.reducer;
