// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocation } from "../redux/slices/locationSlice";
import { AppDispatch, RootState } from "../redux/store";

/**
 * @description Custom Hook to provide user location
 * @returns
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
