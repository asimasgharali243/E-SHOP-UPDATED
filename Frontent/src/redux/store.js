// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authreducer from './features/auth/authSlice';
import ForgetPasswordreducer from './features/auth/ForgetPasswordSlice';
import VerifyOtpreducer from './features/auth/OtpVerifySlice';
import ResetPasswordreducer from './features/auth/ResetPasswordSlice';
import ProductApi from './api/productsApi/ProductApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import ThemeReducer from './features/theme-mode/ThemeSlice';
import CartSliceReducer , { loadCart } from "./features/Cart/SliceCard";
import likeReducer from './features/products/LikeProduct';
import likeDebounceMiddleware from './features/products/LikeMiddleWare';
import userProfileReducer from './api/productsApi/userApi';
import tokenMiddleware from './middleware/Tokensetmiddleware';
export const store = configureStore({
  reducer: {
    authUser: authreducer,
    ForgetPassword: ForgetPasswordreducer,
    VerifyOtp: VerifyOtpreducer,
    resetPassword: ResetPasswordreducer,
    theme: ThemeReducer,
    cart: CartSliceReducer,
    Likes: likeReducer, // Using 'Likes' as the key
    [ProductApi.reducerPath]: ProductApi.reducer,
    [userProfileReducer.reducerPath]: userProfileReducer.reducer
  },
  preloadedState: {
    cart: {
      ...loadCart(),
      status: "idle",
      error: null,
    },
    
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      likeDebounceMiddleware,  
      ProductApi.middleware,
      userProfileReducer.middleware    ,
      tokenMiddleware
    ),
});

setupListeners(store.dispatch);

export default store;