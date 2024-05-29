import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  DeleteProducts,
  GetProductsRes,
  LatestProductsRes,
  NewProductReq,
  SearchProductQuery,
  SearchProductRes,
  UpdateProductsRes,
  categoryRes,
} from "../../types/types";

export const ProductAPI = createApi({
  reducerPath: "ProductAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/product/" }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    
    LatestProducts: builder.query<LatestProductsRes, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),
    
    AllProducts: builder.query<LatestProductsRes, string>({
      query: () => "all",
      providesTags: ["product"],
    }),
    
    getCategory: builder.query<categoryRes, string>({
      query: () => "category",
      providesTags: ["product"],
    }),
    
    GetProducts: builder.query<GetProductsRes, string>({
      query: (id) => id,
      providesTags: ["product"]
    }),
   
    getSearchResult: builder.query<SearchProductRes, SearchProductQuery>({
      query: ({ search, price, category, sort, page }) => {
        let base = `get?search=${search}&page=${page}`;

        if (price) base += `&price=${price}`;
        if (category) base += `&category=${category}`;
        if (sort) base += `&sort=${sort}`;

        const urlParams = new URLSearchParams();
        urlParams.set("/search", base);

        return base;
      },
    }),
    CreateProduct: builder.mutation<LatestProductsRes, NewProductReq>({
      query: ({ formData }) => ({
        url: "new",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    UpdateProduct: builder.mutation<LatestProductsRes, UpdateProductsRes>({
      query: ({ formData, productId }) => ({
        url: productId,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    DeleteProducts: builder.mutation<GetProductsRes, DeleteProducts>({
      query: ({ ProductId }) => ({
        url: ProductId,
        method: "DELETE"
      }),

      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useGetCategoryQuery,
  useGetSearchResultQuery,
  useCreateProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductsMutation
} = ProductAPI;
