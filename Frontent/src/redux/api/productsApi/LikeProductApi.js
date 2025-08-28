// src/redux/api/likeApi.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import apis from "../../../utils/apis";

// Toggle like
export const toggleLikeAPI = createAsyncThunk(
  "Likes/toggleLike", // FIX: Use "Likes" instead of "likes"
  async (productId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apis().baseUrl}${apis().likeProduct(productId)}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to toggle like");
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to toggle like");
    }
  }
);

// Sync likes
export const syncLikesAPI = createAsyncThunk(
  "Likes/syncLikes", // FIX: Use "Likes" instead of "likes"
  async (_, { getState, rejectWithValue }) => {
    try {
      // FIX: Access state.Likes instead of state.likes
      const { likedProducts, version } = getState().Likes;
      const res = await fetch(`${apis().baseUrl}${apis().syncLikes}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ likedProducts, version }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to sync likes");
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to sync likes");
    }
  }
);