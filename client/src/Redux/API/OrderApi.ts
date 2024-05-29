import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NewOrderReq, OrderType, newOrderReqType } from "../../types/ReduxType";

type message = {
  success: boolean;
  message: string;
};

type AllOrderRes = {
  success: boolean;
  orders: OrderType[];
};

type OrderDetail = {
    success: boolean;
    order: OrderType;
  };

export const OrderApi = createApi({
  reducerPath: "OrderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/order/" }),
  tagTypes: ["order"],
  endpoints: (builder) => ({

    // create New Order
    CreateOrder: builder.mutation<message, newOrderReqType>({
      query: (order) => ({
        url: "new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["order"],
    }),

    // update order
    UpdateOrder: builder.mutation<message, string>({
        query: (id) => ({
          url: `update/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["order"],
      }),

      DeleteOrder: builder.mutation<message, string>({
        query: (id) => ({
          url: `delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["order"],
      }),

    // get order by user id
    GetMyOrder: builder.query<AllOrderRes, string>({
      query: () => "myorders",
      providesTags: ["order"],
    }),

    // get order by user id
    GetAllOrder: builder.query<AllOrderRes, string>({
      query: () => "get",
      providesTags: ["order"],
    }),

    // get single Order by its id
    GetOrderDetail: builder.query<OrderDetail, string>({
      query: (id) => id,
      providesTags: ["order"],
    }),
  }),
});

export const { useCreateOrderMutation, useUpdateOrderMutation, useDeleteOrderMutation, useGetAllOrderQuery, useGetMyOrderQuery, useGetOrderDetailQuery } = OrderApi;
