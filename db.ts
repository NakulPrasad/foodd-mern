import mongoose from "mongoose";
import dotenv from "dotenv";
import DBConfig from "./configs/config.js";
dotenv.config();

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);
    const MONGODB_URI = DBConfig.mongodb_connection_uri;

    try {
        // Connect to MongoDB using Mongoose
        await mongoose.connect(MONGODB_URI);
        console.log("MONGODB connected");

        // Access collections and fetch data
        const foodItemCollection = mongoose.connection.collection("foodItems");
        const foodData = await foodItemCollection.find({}).toArray();
        const foodCategoryCollection = mongoose.connection.collection("foodCategory");
        const catData = await foodCategoryCollection.find({}).toArray();
        

        global.foodItems = foodData;
        global.foodCategory = catData;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
