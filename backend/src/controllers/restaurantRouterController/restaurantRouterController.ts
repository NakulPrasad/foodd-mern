import { Request, Response } from "express";
import restaurantService from "../../services/restaurantService.js";

const RestaurantService = restaurantService.getInstance();

export const test = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "restaurant route working" });
};

export const addRestaurant = async (req: Request, res: Response) => {
  const restaurant = req.body;
  const response: boolean =
    await RestaurantService.registerRestaurant(restaurant);
  if (!response) {
    return res.status(500).json({ message: "Failed to add restaurant" });
  }
  return res.status(201).json({ message: "Restaurant Added Successfully" });
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  const restaurantId = req.body.id;
  const response: boolean =
    await RestaurantService.removeRestaurant(restaurantId);
  if (!response) {
    return res.status(500).json({ message: "Failed to remove restaurant" });
  }
  return res.status(201).json({ message: "Restaurant removed Successfully" });
};

export const getAllRestaurant = async (req: Request, res: Response) => {
  const restaurants = await RestaurantService.getAllRestaurant();
  if (!restaurants) {
    return res.status(500).json({ message: "Failed to fetch restaurant" });
  }
  return res
    .status(200)
    .json({
      message: "Fetched all restaurants successfully",
      data: restaurants,
    });
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const restaurant = await RestaurantService.getRestaurantById(id);
  if (!restaurant) {
    return res.status(500).json({ message: "Failed to fetch restaurant" });
  }
  return res
    .status(200)
    .json({ message: "Fetched restaurant successfully", data: restaurant });
};
