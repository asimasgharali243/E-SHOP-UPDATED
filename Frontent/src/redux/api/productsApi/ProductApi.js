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
      query: (productId) => `${apis().getSingleProduct}/${productId}`,
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
        url: apis().updateProduct,
        method: 'PUT',
        body: data,
      }),
    }),

    // DELETE: Delete Product by ID
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${apis().deleteProduct}/${productId}`,
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
      query: (count) =>   `${apis().getSignature}?count=${count}`,
    }),


    rollbackProduct: builder.mutation({

      query: (data) => ({
        url: `${apis().RollbackProductDetails}`,
        method: 'DELETE',
        body: data,
      }),
    })
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
