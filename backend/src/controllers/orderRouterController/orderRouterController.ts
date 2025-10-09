import { Request, Response } from "express";
import authService from "../../services/authService.js";
import orderService from "../../services/orderService.js";

const OrderService = orderService.getInstance();
const AuthService = authService.getInstance();

export const orderTest = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Working OrderModel Router" });
};

// export const orderCheckout = async (req: Request, res: Response) => {
//   const data = req.body.order_data;
//   // const { email } = req.user!;
//   const email = (req.user as any).email;

//   await data.splice(0, 0, { Order_date: req.body.order_date });

//   const user = await OrderModel.findOne({ email: email });

//   if (!user) {
//     try {
//       const order = await OrderModel.create({
//         email: email,
//         order_data: [data],
//       });
//       if (!order) {
//         return res.status(204).json({ message: "OrderModel Can't be added" });
//       }
//       return res.status(201).json({ message: "OrderModel Successfully added" });
//     } catch (error: any) {
//       console.error(error.message);

//       return res
//         .status(500)
//         .json({ message: "Can't Place order", error: error.message });
//     }
//   }
//   const order = await OrderModel.findOneAndUpdate(
//     { email: email },
//     { $push: { order_data: data } },
//   );
//   if (!order) {
//     return res.status(204).json({ message: "OrderModel Can't be added" });
//   }
//   return res.status(201).json({ message: "OrderModel Successfully added" });
// };

// export const getMyOrders = async (req: Request, res: Response) => {
//   try {
//     const email = (req.user as any).email;
//     if (!email) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     const orders = await OrderModel.findOne({ email: email });
//     return res.status(200).json({ orderData: orders });
//   } catch (error: any) {
//     return res.send("Server error");
//   }
// };
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

export const addOrder = async (req: Request, res: Response) => {
  const order = req.body;
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
