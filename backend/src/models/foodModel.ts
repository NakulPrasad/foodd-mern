import { model, Schema, Types } from "mongoose";

export const foodItemSchema = new Schema({
  name: String,
  restaurantId: {type : Types.ObjectId, ref: "restaurants", required : true},
  restaurntName: String,
  description: String,
  price: Number,
  category: String,
  img_url: String,
  rating: Number,
  is_veg: Boolean,
  options: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
      values: [
        {
          label: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
});

export interface IFoodItem {
  name: String;
  restaurantId: Types.ObjectId;
  restaurntName: String;
  description: String;
  price: Number;
  category: String;
  img_url: String;
  rating: Number;
  is_veg: Boolean;
  options: [
    {
      name: String;
      type: String;
      values: { label: string; price: number }[];
    },
  ];
}

export default model("foodItems", foodItemSchema);
