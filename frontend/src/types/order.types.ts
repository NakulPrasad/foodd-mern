import { IFoodItem } from "./food.types";
import { IRestaurant } from "./restaurant.types";

export interface IOrder {
  _id: string;
  customerId: string;
  restaurantId: IRestaurant;
  items: {
    foodItemId: IFoodItem;
    quantity: number;
    price: number;
  }[];

  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
}
