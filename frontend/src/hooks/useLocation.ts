import { useDispatch, useSelector } from "react-redux";
import { clearLocationError, fetchLocation, setCity } from "../redux/slices/locationSlice";
import { AppDispatch, RootState } from "../redux/store";

/**
 * Custom Hook to access and manage user's location.
 */
export const useLocation = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { city, loading, error } = useSelector(
    (state: RootState) => state.location,
  );

  const getLocation = () => {
    dispatch(fetchLocation());
  };

  const handleSetCity = (newCity: string) => {
    dispatch(setCity(newCity));
  };

  const clearError = () => {
    dispatch(clearLocationError());
  };

  return { city, loading, error, getLocation, setCity: handleSetCity, clearError };
};
