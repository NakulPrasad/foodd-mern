import { Document, model, Schema, Types } from "mongoose";

export interface IOrderModel extends Document {
  customerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  items: {
    foodItemId: { type: Types.ObjectId; ref: "foodItems"; required: true };
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

const OrderSchema = new Schema(
  {
    customerId: { type: Types.ObjectId, ref: "user", required: true },
    restaurantId: { type: Types.ObjectId, ref: "restaurant", required: true },

    items: [
      {
        foodItemId: { type: Types.ObjectId, ref: "foodItems", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // snapshot price at the time of order
      },
    ],
    deliveryFee : {type : Number, required: true},
    gstAndCharges : {type: Number, required: true},
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    deliveryAddress: { type: String, required: true },
  },
  { timestamps: true },
);

export default model("order", OrderSchema);
