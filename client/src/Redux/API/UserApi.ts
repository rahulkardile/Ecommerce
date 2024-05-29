import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User, messageRes } from "../../types/types";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/user/" }),
    endpoints: (builder) => ({
        GoogleHandler: builder.mutation<messageRes, User>({
            query: (user) => ({
                url: "google",
                method: "POST",
                body: user
            })
        }),
        ManualHandler: builder.mutation<messageRes, User>({ 
            query: (user) => ({
                url: "login",
                method: "POST",
                body: user
        })})
    })
})

export const { useGoogleHandlerMutation, useManualHandlerMutation } = userApi