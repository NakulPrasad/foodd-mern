import express from "express";
import {
  addFoodCategory,
  addFoodItem2,
  addFoodItemBulk,
  deleteFoodItemById,
  deleteFoodItemByName,
  foodTest,
  getAllFoodCategory,
  getAllFoodItemByRestaurantId,
} from "../controllers/food.controller.js";
import authenticateToken from "../middleware/jwtAuth.js";

export const foodRouter = express.Router();
foodRouter.use(authenticateToken);
foodRouter.get("/test", foodTest);
foodRouter.get("/getAllFoodItemByRestaurantId", getAllFoodItemByRestaurantId);
// foodRouter.get("/getAllFoodItemByRestaurantId", getAllFoodItemByRestaurantId2);
foodRouter.get("/getAllFoodCategory", getAllFoodCategory);
// foodRouter.post("/addFoodItem", addFoodItem);
foodRouter.post("/addFoodItem", addFoodItem2);
foodRouter.post("/addFoodItemBulk", addFoodItemBulk);
foodRouter.post("/addFoodCategory", addFoodCategory);
foodRouter.delete("/deleteFoodItemByName", deleteFoodItemByName);
foodRouter.delete("/deleteFoodItemById", deleteFoodItemById);
