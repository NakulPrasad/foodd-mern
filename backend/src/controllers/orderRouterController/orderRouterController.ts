import { Request, Response } from "express";
import { IOrderModel } from "../../models/orderModel.js";
import authService from "../../services/authService.js";
import orderService from "../../services/orderService.js";
import { IAuthenticatedRequest } from "../../types/auth.js";

const OrderService = orderService.getInstance();
const AuthService = authService.getInstance();

export const orderTest = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Working OrderModel Router" });
};

export const getMyOrders = async (req: Request, res: Response) => {
  const currentUser = await AuthService.getCurrentUser(req, res);
  // console.log(currentUser);
  const orders = await OrderService.getMyOrders(currentUser.id);
  if (!orders) {
    console.error("Order ID not found");
    return false;
  }
  return res
    .status(200)
    .json({ message: "Fetched order details successfully", data: orders });
};

export const getOrdersByUserId = async (req: Request, res: Response) => {
  const id = req.params.id;
  const orders = await OrderService.getOrderByUserId(id);
  if (!orders) {
    return res
      .status(500)
      .json({ message: "Failed to fetch OrderModel Details" });
  }
  return res
    .status(200)
    .json({ message: "Fetched order details successfully", data: orders });
};

export const addOrder = async (req: IAuthenticatedRequest, res: Response) => {
  const order: IOrderModel = {
    restaurantId: req.body.restaurantId,
    items: req.body.items,
    totalAmount: req.body.totalAmount,
    deliveryFee: req.body.deliveryFee,
    gstAndCharges: req.body.gstAndCharges,
    status: req.body.status,
    paymentStatus: req.body.paymentStatus,
    deliveryAddress: req.body.deliveryAddress,
    customerId: req.user.id,
  };
  const orderAdded: Boolean = await OrderService.addOrder(order);
  if (!orderAdded) {
    return res.status(500).json({ message: "Failed to create OrderModel" });
  }
  return res.status(200).json({ message: "OrderModel Created Successfully" });
};

// export const removeOrderById=async(req:Request, res:Response)=>{
//   const id = req.body.id;
//   const removeOrder = await
// }
