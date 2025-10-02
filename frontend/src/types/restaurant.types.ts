import { IFoodItem } from "./food.types";

export interface IRestaurant {
  _id: string;
  name: string;
  description: string;
  cuisine: string[];
  location: {
    address: string;
    area: string;
    city: string;
    state: string;
    zipCode: string;
  };
  rating: number;
  image: string;
  isVeg: boolean;
  priceRange: string;
  deliveryTime: string;
  contact: {
    phone: string;
    email: string;
  };
  timing: {
    open: string;
    close: string;
  };
  menu : IFoodItem[];
}