import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apis from "../../../utils/apis";

const ProductApi = createApi({
  reducerPath: 'ProductApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apis().baseUrl,
    credentials: 'include',
  }),
  tagTypes: ["Product"], // For cache invalidation
  endpoints: (builder) => ({
    getAllProduct: builder.query({
      query: () => apis().getAllProducts,
      providesTags: ["Product"],
    }),

    getSingleProduct: builder.query({
      query: (productId) => apis().getSingleProduct(productId),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: apis().createProduct,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: apis().updateProduct(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: apis().deleteProduct(productId),
        method: 'DELETE',
      }),
      invalidatesTags: ["Product"],
    }),

    uploadImage: builder.mutation({
      query: (img) => ({
        url: 'https://upload.imagekit.io/api/v1/files/upload',
        method: 'POST',
        body: img,
        credentials: 'omit',
      }),
    }),

    getSignature: builder.query({
      query: (count) => apis().getSignature(count),
    }),

    rollbackProduct: builder.mutation({
      query: (data) => ({
        url: apis().rollbackProduct,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    addReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: apis().addReview(productId),
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    // Negotiation
    startNegotiation: builder.mutation({
      query: ({ productId, initialMessage }) => ({
        url: apis().negotiateStart,
        method: "POST",
        body: { productId, initialMessage },
      }),
    }),

    postMessage: builder.mutation({
      query: ({ negotiationId, message }) => ({
        url: apis().negotiateMessage(negotiationId),
        method: "POST",
        body: { message },
      }),
    }),

    toggleAI: builder.mutation({
      query: ({ negotiationId }) => ({
        url: apis().negotiateToggleAI(negotiationId),
        method: "PATCH",
      }),
    }),

    updateStatus: builder.mutation({
      query: ({ negotiationId, status, finalPrice }) => ({
        url: apis().negotiateStatus(negotiationId),
        method: "PATCH",
        body: { status, finalPrice },
      }),
    }),

    getNegotiationsByProduct: builder.query({
      query: (productId) => apis().getNegotiationsByProduct(productId),
    }),
  }),
});

export const {
  useGetAllProductQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImageMutation,
  useRollbackProductMutation,
  useGetSignatureQuery,
  useAddReviewMutation,
  useStartNegotiationMutation,
  usePostMessageMutation,
  useToggleAIMutation,
  useUpdateStatusMutation,
  useGetNegotiationsByProductQuery,
} = ProductApi;

export default ProductApi;
