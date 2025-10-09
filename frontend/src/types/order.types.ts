import { IFoodItem } from "./food.types";

export interface IOrder {
  id: string;
  customerId: string;
  restaurantId: string;
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
  createdAt: Date;
  updatedAt: Date;
}
