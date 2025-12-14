// src/api/fetchBaseQuery.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { useCookie } from "../hooks/useCookie";

const { getItem } = useCookie();
const authToken = getItem("authToken");

const fetchBaseQueryWithAuth = (baseUrl: string) =>
  fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, {}) => {
      // const authToken = (getState() as RootState).auth.authToken;
      headers.set("Content-Type", "application/json");

      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }

      return headers;
    },
  });

export default fetchBaseQueryWithAuth;
