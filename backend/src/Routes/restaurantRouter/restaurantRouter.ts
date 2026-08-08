import express from "express";
import {
  addRestaurant,
  getAllRestaurant,
  getRestaurantById,
  test,
} from "../../controllers/restaurantRouterController/restaurantRouterController.js";
import authenticateToken from "../../middleware/authMiddleware.js";

export const restaurantRouter = express.Router();

// Public routes — no auth required
restaurantRouter.get("/test", test);
restaurantRouter.get("/getAllRestaurant", getAllRestaurant);
restaurantRouter.get("/getRestaurantById/:id", getRestaurantById);

// Protected routes — JWT required
// TODO: add admin role guard before production
restaurantRouter.post("/addRestaurant", authenticateToken, addRestaurant);