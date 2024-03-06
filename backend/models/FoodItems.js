import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const foodItemsSchema = new Schema({
name: String,
CategoryName : String,
img:String,
options: [{
    size : String,
    price : Number
}],
description : String,
})

const FoodItems = model('FoodItems',foodItemsSchema);
export default FoodItems;

