import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../../middleware/MiddlewareHeader';
export const userApi = createApi({
  reducerPath: 'userApi',
 baseQuery: fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/auth',
  credentials: "include",
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    return headers;
  },
}),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // FIXED: Remove userid parameter, backend uses auth token
 getProfile: builder.query({
  query: (userId) => `profile?userid=${userId}`,
  providesTags: ['User'],
}),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: 'profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    changePassword: builder.mutation({
      query: (data) => ({
        url: 'change-password',
        method: 'POST',
        body: data,
      }),
    }),
    
   uploadImage: builder.mutation({
  query: ({ image, fileName }) => ({
    url: "/user/upload-profile-image",
    method: "POST",
    body: { image, fileName },
  }),
}),
    
    upgradeSeller: builder.mutation({
      query: () => ({
        url: 'upgrade-seller',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Address endpoints - REMOVE THESE (they don't exist in your backend)
    // addAddress: builder.mutation({
    //   query: (data) => ({
    //     url: 'addresses',
    //     method: 'POST',
    //     body: data,
    //   }),
    //   invalidatesTags: ['User'],
    // }),
    
    // updateAddress: builder.mutation({
    //   query: ({ id, data }) => ({
    //     url: `addresses/${id}`,
    //     method: 'PUT',
    //     body: data,
    //   }),
    //   invalidatesTags: ['User'],
    // }),
    
    // deleteAddress: builder.mutation({
    //   query: (id) => ({
    //     url: `addresses/${id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['User'],
    // }),
    
    // setDefaultAddress: builder.mutation({
    //   query: (id) => ({
    //     url: `addresses/${id}/default`,
    //     method: 'PATCH',
    //   }),
    //   invalidatesTags: ['User'],
    // }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadImageMutation,
  useUpgradeSellerMutation,
  // Remove address mutations
  // useAddAddressMutation,
  // useUpdateAddressMutation,
  // useDeleteAddressMutation,
  // useSetDefaultAddressMutation,
} = userApi;

export default userApi;