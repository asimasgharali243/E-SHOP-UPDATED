// src/redux/api/productsApi/ProductApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apis from "../../../utils/apis";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apis().baseUrl,
    credentials: "include",
  }),
  tagTypes: ["Product", "Products", "Likes"],
  endpoints: (builder) => ({
    // Search products with filters
    searchProducts: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => params.append(key, v));
            } else {
              params.append(key, value);
            }
          }
        });
        return `${apis().getAllProducts}?${params}`;
      },
      providesTags: ["Products"],
    }),

    // Get filter options
    getFilterOptions: builder.query({
      query: () => `${apis().getAllProducts}/filters`,
    }),

    // Get all products
    getAllProducts: builder.query({
      query: () => apis().getAllProducts,
      providesTags: ["Products"],
    }),

    // Get single product
    getSingleProduct: builder.query({
      query: (productId) => apis().getSingleProduct(productId),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Get categories
    getCategories: builder.query({
      query: () => `${apis().baseUrl}${apis().getCategories}`,
    }),

    // Get liked products by IDs
    getLikeProduct: builder.query({
      query: (ids) => ({
        url: apis().getLikeProduct,
        method: "POST",
        body: { ids },
      }),
      providesTags: ["Likes"],
    }),

    // Create product
    createProduct: builder.mutation({
      query: (data) => ({
        url: apis().createProduct,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    // Update product
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: apis().updateProduct(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "Products",
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: apis().deleteProduct(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // Rollback product
    rollbackProduct: builder.mutation({
      query: (productId) => ({
        url: apis().rollbackProduct,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Products"],
    }),

    // Add review
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

    // Product comparison
    getProductComparison: builder.query({
      query: (productName) => ({
        url: `/products/compare?query=${encodeURIComponent(productName)}`,
      }),
    }),

    // Image upload
    uploadImage: builder.mutation({
      query: (img) => ({
        url: "https://upload.imagekit.io/api/v1/files/upload",
        method: "POST",
        body: img,
        credentials: "omit",
      }),
    }),

    // Get signature
    getSignature: builder.query({
      query: (count) => apis().getSignature(count),
    }),

    // Negotiation endpoints
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

// Export hooks
export const {
  useGetAllProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useGetFilterOptionsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRollbackProductMutation, // ✅ Added rollback hook
  useAddReviewMutation,
  useGetProductComparisonQuery,
  useUploadImageMutation,
  useGetSignatureQuery,
  useStartNegotiationMutation,
  usePostMessageMutation,
  useToggleAIMutation,
  useUpdateStatusMutation,
  useGetNegotiationsByProductQuery,
  useGetLikeProductQuery,
  useGetCategoriesQuery,
} = productApi;

export default productApi;
