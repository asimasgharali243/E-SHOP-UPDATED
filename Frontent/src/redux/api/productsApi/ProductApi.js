import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import apis from "../../../utils/apis"
// Define a service using a base URL and expected endpoints
const  ProductApi= createApi({
  reducerPath: 'ProductApi',
  baseQuery: fetchBaseQuery({ baseUrl:apis().baseUrl}),
  endpoints: (builder) => ({
    getAllProduct: builder.query({
      query: () => apis().getAllProduct,
    }),
    getSingleProduct:builder.query({
        query:(productId)=>`${apis().getSingleProduct}/${productId}`
    }),
    createProduct:builder.mutation({
        query:(data)=>({
            url:`${apis().createProduct}`,
            method:'POST',
            body:data
        })
    }),
    updateProduct:builder.mutation({
        query:(data)=>({
            url:`${apis().updateProduct}`,
            method:'PUT',
            body:data
        })
    }),
    deleteProduct:builder.mutation({
        query:(productId)=>({
            url:`${apis().deleteProduct}/${productId}`,
            method:'DELETE',
        })
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetAllProductQuery,
    useGetSingleProductQuery
    ,useUpdateProductMutation
    } = ProductApi



    export default ProductApi;