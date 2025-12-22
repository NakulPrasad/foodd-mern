import { useGetAllRestaurantQuery } from "../redux/slices/apiSlice";
import { useCookie } from "./useCookie";

export const useRestaurant = () => {
  const { setItem, removeItem } = useCookie();
  const {data: allRestaurantJson, error, isLoading} = useGetAllRestaurantQuery();

  const setCurrentRestaurant = (restaurant: string | undefined | null) => {
    if (!restaurant) {
      throw new Error("setCurrentRestaurant : restaurant is empty");
    }
    setItem("currentRestaurant", restaurant);
  };

  const removeCurrentRestaurant = () => {
    removeItem("currentRestaurant");
  };

  if(error){
    console.error("Error Occured while fetching all restaurant",error)
  }
  return { setCurrentRestaurant, removeCurrentRestaurant, isLoading, allRestaurantJson, error };
};
