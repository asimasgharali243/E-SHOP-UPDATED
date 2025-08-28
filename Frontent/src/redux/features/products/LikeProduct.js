import { createSlice } from "@reduxjs/toolkit";
import { toggleLikeAPI, syncLikesAPI } from "../../api/productsApi/LikeProductApi";
import ShowToast from "../../../components/SubComponent/Showtoast";

// --- Helpers ---
const getLikedProducts = () => {
  const likedProducts = localStorage.getItem("likedProducts");
  return likedProducts ? JSON.parse(likedProducts) : [];
}

const saveLikedProducts = (likedProducts) => {
  localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
}

// --- Initial State ---
const initialState = {
  likedProducts: getLikedProducts(),
  status: "idle",
  error: null,
  version: 0, 
};

const likeSlice = createSlice({
  name: "Likes",
  initialState,
  reducers: {
    toggleLocalLike: (state, action) => {
      const productId = action.payload;
      const index = state.likedProducts.indexOf(productId);

      if (index > -1) {
        state.likedProducts.splice(index, 1);
      } else {
        state.likedProducts.push(productId);
      }

      // Persist to localStorage
      saveLikedProducts(state.likedProducts);
    },

    rollbackLike: (state, action) => {
      const productId = action.payload;
      const index = state.likedProducts.indexOf(productId);

      if (index > -1) {
        state.likedProducts.splice(index, 1);
      } else {
        state.likedProducts.push(productId);
      }

      saveLikedProducts(state.likedProducts);
    },

    setLikes: (state, action) => {
      state.likedProducts = action.payload;
      saveLikedProducts(state.likedProducts);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleLikeAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleLikeAPI.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.likedProducts = action.payload.likedProducts || state.likedProducts;
        state.version = action.payload.version || state.version;

        // Persist to localStorage
        saveLikedProducts(state.likedProducts);

        ShowToast("success", "Like updated", "top-right");
      })
      .addCase(toggleLikeAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        ShowToast("error", action.payload || "Failed to update like", "top-right");
      })
      .addCase(syncLikesAPI.fulfilled, (state, action) => {
        state.likedProducts = action.payload.likedProducts || [];
        state.version = action.payload.version || state.version;
        state.status = "succeeded";
        state.error = null;

        // Persist to localStorage
        saveLikedProducts(state.likedProducts);

        ShowToast("success", "Likes synced", "top-right");
      })
      .addCase(syncLikesAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        ShowToast("error", action.payload || "Failed to sync likes", "top-right");
      });
  },
});

export const { toggleLocalLike, rollbackLike, setLikes } = likeSlice.actions;
export default likeSlice.reducer;
