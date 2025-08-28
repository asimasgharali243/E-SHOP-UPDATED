// src/redux/middleware/likeDebounce.js
import { toggleLikeAPI, syncLikesAPI } from "../../api/productsApi/LikeProductApi";
import { toggleLocalLike, rollbackLike } from "../../features/products/LikeProduct";
import ShowToast from "../../../components/SubComponent/Showtoast";

let likeTimer = null;
let syncTimer = null;
let pendingSync = false;

const likeDebounceMiddleware = (store) => (next) => (action) => {
  const state = store.getState();
  
  // Handle sync on specific actions
  if (action.type === 'auth/login/fulfilled' || action.type === 'APP_INIT') {
    // Sync likes after login or app initialization
    store.dispatch(syncLikesAPI())
      .unwrap()
      .catch(error => {
        console.error('Failed to sync likes:', error);
      });
  }
  
  if (action.type === toggleLocalLike.type) {
    const productId = action.payload;
    
    if (!state.Likes) {
      console.error("Likes state is undefined!");
      return next(action);
    }
    
    const isCurrentlyLiked = state.Likes.likedProducts.includes(productId);

    if (likeTimer) {
      clearTimeout(likeTimer);
    }

    const result = next(action);

    likeTimer = setTimeout(() => {
      store.dispatch(toggleLikeAPI(productId))
        .unwrap()
        .then(() => {
          // Schedule a sync after successful like operation
          pendingSync = true;
          if (syncTimer) clearTimeout(syncTimer);
          syncTimer = setTimeout(() => {
            if (pendingSync) {
              store.dispatch(syncLikesAPI());
              pendingSync = false;
            }
          }, 2000); // Sync 2 seconds after last change
        })
        .catch((error) => {
          store.dispatch(rollbackLike(productId));
          ShowToast('error', error || 'Failed to update like', 'top-right');
        });
    }, 400);

    return result;
  }

  return next(action);
};

// Add periodic sync function
export const startPeriodicSync = (store, interval = 300000) => { // 5 minutes
  setInterval(() => {
    if (store.getState().authUser.isAuthenticated) {
      store.dispatch(syncLikesAPI())
        .unwrap()
        .catch(error => {
          console.error('Periodic sync failed:', error);
        });
    }
  }, interval);
};

export default likeDebounceMiddleware;