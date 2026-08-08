import { useDispatch, useSelector } from "react-redux";
import { fetchLocation } from "../redux/slices/locationSlice";
import { AppDispatch, RootState } from "../redux/store";

/**
 * Custom Hook to access and manage user's location.
 * 
 * @remarks 
 * - Reads location state from Redux Store.
 * - Provides a dispacher fnction to trigger location fetching.
 * 
 * @returns An object containing:
 * - `city` : current city
 * - `loading`: A boolean indicating if location is being fetched.
 * - `error`: Any error encountered while fetching location
 * - `getLocation`: A function to fetch Location of user
 */

export const useLocation = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { city, loading, error } = useSelector(
    (state: RootState) => state.location,
  );

  const getLocation = () => {
    dispatch(fetchLocation());
  };
  return { city, loading, error, getLocation };
};
