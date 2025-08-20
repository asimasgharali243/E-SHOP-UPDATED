import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apis from "../../../utils/apis";

// Create the Product API slice
const ProductApi = createApi({
  reducerPath: 'ProductApi',
  baseQuery: fetchBaseQuery({
  baseUrl: apis().baseUrl,
  credentials: 'include', 
}),
  endpoints: (builder) => ({
    // GET: All Products
    getAllProduct: builder.query({
      query: () => apis().getAllProduct,
    }),

    // GET: Single Product by ID
    getSingleProduct: builder.query({
      query: (productId) => `${apis().getSingleProduct(productId)}`,
    }),

    // POST: Create Product
    createProduct: builder.mutation({
      query: (data) => ({
        url: apis().createProduct,
        method: 'POST',
        credentials: 'include',
        body: data,
      }),
    }),

    // PUT: Update Product
    updateProduct: builder.mutation({
      query: (data) => ({
        url: apis().updateProduct(data.id),
        method: 'PUT',
        body: data,
      }),
    }),

    // DELETE: Delete Product by ID
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${apis().deleteProduct(productId)}`,
        method: 'DELETE',
      }),
    }),
 uploadImage: builder.mutation({
  query: (img) => ({
    url: 'https://upload.imagekit.io/api/v1/files/upload',
    method: 'POST',
    body: img,
    credentials: 'omit', 
  }),
}),
    GetSignature: builder.query({
      query: (count) =>   `${apis().getSignature(count)}`,
    }),


    rollbackProduct: builder.mutation({

      query: (data) => ({
        url: `${apis().RollbackProductDetails}`,
        method: 'DELETE',
        body: data,
      }),
    }),
     addReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: `${apis().AddReview(productId)}`, // ✅ Correct endpoint
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),
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

// Export auto-generated hooks for components
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
  useGetNegotiationsByProductQuery, // ✅ add this hook
} = ProductApi;
//  Export endpoints for use in middleware/tests
export const {
  endpoints: {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllProduct,
    getSingleProduct,

  },
} = ProductApi;

// Export the API slice for store registration
export default ProductApi;
