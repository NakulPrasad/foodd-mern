import express from "express"
import {addRestaurant, getAllRestaurant, getRestaurantById, test, } from "../../controllers/restaurantRouterController/restaurantRouterController.js"

export const restaurantRouter = express.Router();
restaurantRouter.get("/test", test)
restaurantRouter.get("/getAllRestaurant", getAllRestaurant)
restaurantRouter.get("/getRestaurantById/:id", getRestaurantById)
restaurantRouter.post("/addRestaurant", addRestaurant)