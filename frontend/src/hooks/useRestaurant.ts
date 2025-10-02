import { useLocalStorage } from "./useLocalStorage";

export const useRestaurant = () => {
  const { setItem, removeItem } = useLocalStorage();

  const setCurrentRestaurant = (restaurant: string | undefined | null) => {
    if (!restaurant) {
      throw new Error("setCurrentRestaurant : restaurant is empty");
    }
    setItem("currentRestaurant", restaurant);
  };

  const removeCurrentRestaurant = () => {
    removeItem("currentRestaurant");
  };

  return { setCurrentRestaurant, removeCurrentRestaurant };
};
