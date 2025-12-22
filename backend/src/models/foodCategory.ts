import { Document, model, Schema } from "mongoose";

const foodCategorySchema = new Schema({
  CategoryName: String,
});

export interface foodCategoryInterface extends Document {
  CategoryName: String;
}

export default model("foodCategory", foodCategorySchema);
