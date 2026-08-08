import { createApi } from "@reduxjs/toolkit/query/react";
import URLs, { BASE_URL } from "../../configs/URLs";
import {
  IAllRestaurantResponse,
  IGetResponseRestaurantById,
} from "../../types";
import {
  ICheckAuthResponse,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
} from "../../types/authentication.types";
import { IOrder } from "../../types/order.types";
import fetchBaseQueryWithAuth from "../baseQueryWithAuth";

const apiBaseQuery = fetchBaseQueryWithAuth(BASE_URL);

export const apiSlice = createApi({
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    checkAuth: builder.query<ICheckAuthResponse, void>({
      query: () => URLs.checkAuth,
    }),
    loginRequest: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (user) => ({
        url: URLs.loginUser,
        method: "POST",
        body: user,
      }),
    }),
    registerRequest: builder.mutation<IRegisterResponse, IRegisterRequest>({
      query: (user) => ({
        url: URLs.addUser,
        method: "POST",
        body: user,
      }),
    }),
    getAllRestaurant: builder.query<IAllRestaurantResponse, void>({
      query: () => URLs.getAllRestaurant,
    }),
    getRestaurantById: builder.query<IGetResponseRestaurantById, string>({
      query: (id) => URLs.getRestaurantById + "/" + id,
    }),
    getMyOrders: builder.query<{ data: IOrder[] }, void>({
      query: () => URLs.getOrders,
    }),
    postOrder: builder.mutation({
      query: (order) => ({
        url: URLs.postOrder,
        method: "POST",
        body: order,
      }),
    }),
  }),
});

export const {
  useCheckAuthQuery,
  useLoginRequestMutation,
  useRegisterRequestMutation,
  useGetAllRestaurantQuery,
  useGetRestaurantByIdQuery,
  useGetMyOrdersQuery,
  usePostOrderMutation,
} = apiSlice;
