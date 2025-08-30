import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customBaseQuery = (baseUrl) => 
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // First try to get tokens from localStorage
      let accessToken = localStorage.getItem('accessToken');
      let refreshToken = localStorage.getItem('refreshToken');

      // If not found in localStorage, try to get from cookies
      if ((!accessToken || !refreshToken) && typeof document !== 'undefined') {
        const cookies = document.cookie.split('; ');
        const accessCookie = cookies.find(row => row.startsWith('myAccessToken='));
        const refreshCookie = cookies.find(row => row.startsWith('myRefreshToken='));
        
        if (accessCookie && !accessToken) {
          accessToken = accessCookie.split('=')[1];
          localStorage.setItem('accessToken', accessToken);
        }
        if (refreshCookie && !refreshToken) {
          refreshToken = refreshCookie.split('=')[1];
          localStorage.setItem('refreshToken', refreshToken);
        }
      }

      // Set headers if tokens are available
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      if (refreshToken) {
        headers.set('X-Refresh-Token', refreshToken);
      }

      return headers;
    },
  });