import { createSlice } from "@reduxjs/toolkit";
import { resetPasswordApi } from "../../api/authapi/resetPasswordApi";
import ShowToast from "../../../components/SubComponent/Showtoast";

const ResetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState: {
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {
    clearResetState: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPasswordApi.pending, (state) => {
        state.status = "loading";
        
      })
      .addCase(resetPasswordApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        ShowToast(
          "success",
          action.payload?.data?.message || "Password reset successfully",
          "top-right"
        );
      })
      .addCase(resetPasswordApi.rejected, (state, action) => {
        state.status = "failed";
        ShowToast("error", action.payload.message || "Network error", "top-right");
      });
  },
});

export const { clearResetState } = ResetPasswordSlice.actions;
export default ResetPasswordSlice.reducer;
