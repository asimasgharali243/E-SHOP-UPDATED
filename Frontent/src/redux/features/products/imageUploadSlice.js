// redux/features/products/imageUploadSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { uploadImage,getUploadSignature } from '../../api/productsApi/SignUpload';
const imageUploadSlice = createSlice({
  name: 'imageUpload',
  initialState: {
    imageUrl: '',
    loading: false,
    error: null,
  },
  reducers: {
    resetImageUpload: (state) => {
      state.imageUrl = '';
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUrl = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});




export const { resetImageUpload } = imageUploadSlice.actions;
export default imageUploadSlice.reducer;
