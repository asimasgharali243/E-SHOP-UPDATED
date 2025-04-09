import { createSlice } from "@reduxjs/toolkit";
import { resetPasswordApi } from "../../api/authapi/resetPasswordApi";
import  ShowToast from "../../../components/SubComponent/Showtoast";
const ResetPasswordSlice = createSlice({
  name: "ResetPassword",
  initialState: { loading: false, success: false, error: null },
  reducers: {
    clearResetState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPasswordApi.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(resetPasswordApi.fulfilled, (state,action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        ShowToast("success", `${action.payload.data.message || "Password reset successfully"}`, "top-right");
      })
      .addCase(resetPasswordApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        ShowToast("error", `${action.payload || "Network error"}`, "top-right");
      });
  },
});

export const { clearResetState } = ResetPasswordSlice.actions;
export default ResetPasswordSlice.reducer;
