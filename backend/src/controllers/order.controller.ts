import { NextFunction, Request, Response } from "express";
import { IOrderModel } from "../models/order.js";
import authService from "../services/authService.js";
import orderService from "../services/orderService.js";
import { IAuthenticatedRequest } from "../types/auth.js";
import stripe from "../configs/stripeConfig.js";

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

export const addOrder = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
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
  const orderAdded = await OrderService.addOrder(order);
  if (!orderAdded) {
    return res.status(500).json({ message: "Failed to create OrderModel" });
  }
  return res.status(200).json({ message: "OrderModel Created Successfully" });
};

/**
 * Creates a pending order in DB and a Stripe Checkout Session.
 * Returns the Stripe checkout URL for the client to redirect to.
 */
export const createCheckoutSession = async (
  req: IAuthenticatedRequest,
  res: Response,
) => {
  console.log("\n=== [createCheckoutSession] Request received ===");
  console.log("[createCheckoutSession] User:", req.user?.id, req.user?.email);

  try {
    const {
      restaurantId,
      items,
      totalAmount,
      deliveryFee,
      gstAndCharges,
      deliveryAddress,
      restaurantName,
      cartItems,
    } = req.body;

    console.log("[createCheckoutSession] Body parsed:");
    console.log("  restaurantId:", restaurantId);
    console.log("  totalAmount:", totalAmount, "| deliveryFee:", deliveryFee, "| gst:", gstAndCharges);
    console.log("  cartItems count:", cartItems?.length);
    console.log("  cartItems:", JSON.stringify(cartItems, null, 2));

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

    // 1. Create a pending order in the DB first
    console.log("[createCheckoutSession] Step 1: Creating pending order in DB...");
    const pendingOrder: IOrderModel = {
      restaurantId,
      items,
      totalAmount,
      deliveryFee,
      gstAndCharges,
      status: "pending",
      paymentStatus: "pending",
      deliveryAddress,
      customerId: req.user.id,
    };

    const createdOrder = await OrderService.addOrder(pendingOrder);
    if (!createdOrder) {
      console.error("[createCheckoutSession] ❌ DB order creation failed");
      return res.status(500).json({ message: "Failed to create order" });
    }

    const orderId = (createdOrder as any)._id.toString();
    console.log("[createCheckoutSession] ✅ Pending order created, orderId:", orderId);

    // 2. Build Stripe line items from cart items
    console.log("[createCheckoutSession] Step 2: Building Stripe line items...");
    const lineItems = (cartItems as any[]).map((item) => {
      const unitAmount = Math.max(50, Math.round(Number(item.price) * 100));
      console.log(`  Item: "${item.name}" | price: ₹${item.price} | unit_amount (paise): ${unitAmount} | qty: ${item.quantity}`);
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: String(item.name || "Food Item"),
            ...(item.description ? { description: String(item.description) } : {}),
          },
          unit_amount: unitAmount,
        },
        quantity: Math.max(1, Number(item.quantity)),
      };
    });

    if (Number(deliveryFee) > 0) {
      const dfAmount = Math.max(50, Math.round(Number(deliveryFee) * 100));
      console.log(`  + Delivery Fee: ₹${deliveryFee} → ${dfAmount} paise`);
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Delivery Fee", description: "Delivery charge" },
          unit_amount: dfAmount,
        },
        quantity: 1,
      });
    }

    if (Number(gstAndCharges) > 0) {
      const gstAmount = Math.max(50, Math.round(Number(gstAndCharges) * 100));
      console.log(`  + GST & Charges: ₹${gstAndCharges} → ${gstAmount} paise`);
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: { name: "GST & Charges", description: "Taxes and levies" },
          unit_amount: gstAmount,
        },
        quantity: 1,
      });
    }

    // 3. Create Stripe Checkout Session
    console.log("[createCheckoutSession] Step 3: Calling stripe.checkout.sessions.create...");
    console.log("  success_url:", `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout`,
      metadata: {
        orderId,
        customerId: req.user.id,
        restaurantName: restaurantName || "",
      },
    });

    console.log("[createCheckoutSession] ✅ Stripe session created:", session.id);
    console.log("[createCheckoutSession] Redirect URL:", session.url);
    console.log("=================================================\n");

    return res.status(200).json({
      message: "Checkout session created",
      url: session.url,
      sessionId: session.id,
      orderId,
    });
  } catch (error: any) {
    console.error("\n[createCheckoutSession] ❌ ERROR:");
    console.error("  Type:", error?.type);
    console.error("  Code:", error?.code);
    console.error("  Param:", error?.param);
    console.error("  Message:", error?.message);
    console.error("  Raw message:", error?.raw?.message);
    console.error("  Full error:", JSON.stringify(error, null, 2));
    console.error("=================================================\n");
    const stripeMessage = error?.raw?.message || error?.message || "Failed to create payment session";
    return res.status(500).json({ message: stripeMessage });
  }
};
;

/**
 * Verifies the Stripe Checkout Session, and if paid,
 * updates the order in the DB to confirmed + paid.
 */
export const verifyPayment = async (
  req: IAuthenticatedRequest,
  res: Response,
) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const orderId = session.metadata?.orderId;
      if (!orderId) {
        return res
          .status(400)
          .json({ message: "Order ID missing in session metadata" });
      }

      const updated = await OrderService.updateOrderPaymentStatus(
        orderId,
        "paid",
        "confirmed",
      );

      if (!updated) {
        return res.status(500).json({ message: "Failed to update order status" });
      }

      return res.status(200).json({
        message: "Payment verified and order confirmed",
        orderId,
        paymentStatus: "paid",
      });
    } else {
      return res.status(402).json({
        message: "Payment not completed",
        paymentStatus: session.payment_status,
      });
    }
  } catch (error: any) {
    console.error("Error verifying Stripe payment:", error.message);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
};
