import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "./store";

/**
 * RTK Query base query with dynamic JWT auth header.
 *
 * Reads the token from Redux state on EVERY request (not once at module load),
 * so login/logout token changes are always reflected immediately.
 */
const fetchBaseQueryWithAuth = (baseUrl: string) =>
  fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");

      // Read token dynamically from Redux state on each request
      const token = (getState() as RootState).auth.authToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });

export default fetchBaseQueryWithAuth;
