import { model, Schema } from "mongoose";

export interface ICouponModel {
  code: string;
  title: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  maxDiscount?: number | null;
  minOrderAmount: number;
  validity: {
    startDate: Date;
    endDate: Date;
  };
  isActive: boolean;
  usageLimit?: number;
}

const CouponSchema = new Schema<ICouponModel>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ["percentage", "flat"], required: true },
    discountValue: { type: Number, required: true },
    maxDiscount: { type: Number, default: null },
    minOrderAmount: { type: Number, required: true, default: 0 },
    validity: {
      startDate: { type: Date, required: true, default: Date.now },
      endDate: { type: Date, required: true },
    },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: null },
  },
  { timestamps: true },
);

export default model<ICouponModel>("coupon", CouponSchema);
