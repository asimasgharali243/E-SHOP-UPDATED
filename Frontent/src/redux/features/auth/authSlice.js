import { createSlice } from "@reduxjs/toolkit";
import { register, login, logout } from "../../api/authapi/authapi";
import ShowToast from "../../../components/SubComponent/Showtoast";

// Local Storage Helpers
const AuthUser = "authUser";

const getStoredUser = () => {
  try {
    const user = sessionStorage.getItem(AuthUser);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const storeUser = (userData) => {
  try {
    sessionStorage.setItem(AuthUser, JSON.stringify(userData));
  } catch {}
};

const clearStoredUser = () => {
  try {
    sessionStorage.removeItem(AuthUser);
  } catch {}
};

// Redux Slice
const authSlice = createSlice({
  name: "authUser",
  initialState: {
    user: getStoredUser(),
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ----- REGISTER -----
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        // Store the full user object
        state.user = action.payload.data?.user || action.payload;
        state.status = "succeeded";
        storeUser(state.user);
        ShowToast(
          "success",
          action.payload.message || "Registered successfully",
          "top-right"
        );
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        ShowToast(
          "error",
          action.payload?.message || "Registration failed",
          "top-right"
        );
      })

      // ----- LOGIN -----
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        // Store the full user object
        console.log(action.payload.data);
        state.user = action.payload.data || action.payload.data?.user || action.payload;
        state.status = "succeeded";
        storeUser(state.user);
        ShowToast(
          "success",
          action.payload.message || "Login successful",
          "top-right"
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        ShowToast(
          "error",
          action.payload?.message || "Login failed",
          "top-right"
        );
      })

      // ----- LOGOUT -----
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        clearStoredUser();
        ShowToast("success", "Logout successful", "top-right");
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        ShowToast(
          "error",
          action.payload?.message || "Logout failed",
          "top-right"
        );
      });
  },
});

export default authSlice.reducer;
