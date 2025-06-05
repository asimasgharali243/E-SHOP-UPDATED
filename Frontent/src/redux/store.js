// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authreducer from './features/auth/authSlice';
import ForgetPasswordreducer from './features/auth/ForgetPasswordSlice';
import VerifyOtpreducer from './features/auth/OtpVerifySlice';
import ResetPasswordreducer from './features/auth/ResetPasswordSlice';
import ProductApi from './api/productsApi/ProductApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import ThemeReducer from './features/theme-mode/ThemeSlice';

export const store = configureStore({
  reducer: {
    authUser: authreducer,
    ForgetPassword: ForgetPasswordreducer,
    VerifyOtp: VerifyOtpreducer,
    resetPassword: ResetPasswordreducer,
    theme: ThemeReducer,
    [ProductApi.reducerPath]: ProductApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ProductApi.middleware),
});

setupListeners(store.dispatch);

export default store;