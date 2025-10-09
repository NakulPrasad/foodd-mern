import { Types } from "mongoose";
import OrderModel, { IOrderModel } from "../models/orderModel.js";

export default class orderService {
  private static instance: orderService;
  private constructor() {}

  public static getInstance(): orderService {
    if (!orderService.instance) {
      orderService.instance = new orderService();
    }
    return orderService.instance;
  }

  async getOrderByUserId(
    userId: Types.ObjectId | string,
  ): Promise<boolean | IOrderModel[] | []> {
    try {
      const orders = await OrderModel.find({ customerId: userId }).lean<
        IOrderModel[]
      >();
      if (!orders) {
        console.error("Order ID not found");
        return false;
      }
      return orders;
    } catch (error: any) {
      console.error("Error while fetching orders by id", error.message);
      return false;
    }
  }

  async addOrder(order: IOrderModel): Promise<boolean> {
    try {
      const orderAdded = await OrderModel.create(order);
      if (!orderAdded) {
        console.error("Can't Create Order");
        return false;
      }
      return true;
    } catch (error: any) {
      console.error("Error while creating order", error.message);
      return false;
    }
  }

  async getMyOrders(id: Types.ObjectId) {
    try {
      // console.log(id)
      const orders = await OrderModel.find({ customerId: id })
        .populate({ path: "restaurantId", select: "name location" }).populate({path:"items.foodItemId" , select : "name"})
        .lean<IOrderModel[]>();
      if (!orders) {
        console.error("Order ID not found");
        return false;
      }
      return orders;
    } catch (error: any) {
      console.error("Error while fetching my orders", error.message);
      return false;
    }
  }
}
