// src/hooks/useSyncLikes.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { syncLikesAPI } from '../../redux/api/productsApi/LikeProductApi';

export const useSyncLikes = () => {
  const dispatch = useDispatch();
  const {  user } = useSelector(state => state.authUser);
  const { status, error, version } = useSelector(state => state.Likes);

  // Memoized sync function to prevent unnecessary re-renders
  const syncLikes = useCallback(() => {
    if (user) {
      dispatch(syncLikesAPI());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if ( user) {
      syncLikes();
    }
  }, [user, syncLikes]);
  return { status, error, syncLikes, version };
};