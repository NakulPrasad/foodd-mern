import { Request, Response } from "express";
import { IFoodItem } from "../../models/foodModel.js";
import foodService from "../../services/foodService.js";

const FoodService = foodService.getInstance();

export const foodTest = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Working Food Path" });
};

export const getAllFoodItemByRestaurantId = async (
  req: Request,
  res: Response,
) => {
  const restaturantId = req.params.id;
  const foodItems = await FoodService.getAllFoodItems(restaturantId);
  if (!foodItems) {
    return res.status(500).json({ message: "Failed to fetch food items" });
  }
  return res
    .status(200)
    .json({ message: "Fetched food items successfully", data: foodItems });
};

export const getAllFoodItemByRestaurantId2 = async (
  req: Request,
  res: Response,
) => {
  const restaturantId = req.params.id;
  const foodItems = await FoodService.getAllFoodItems2(restaturantId);
  console.log(foodItems);
  if (!foodItems) {
    return res.status(500).json({ message: "Failed to fetch food items" });
  }
  return res
    .status(200)
    .json({ message: "Fetched food items successfully", data: foodItems });
};

export const getAllFoodCategory = async (req: Request, res: Response) => {
  const response: Response = await FoodService.getAllFoodCategory(res);
  return response;
};

export const addFoodCategory = async (req: Request, res: Response) => {
  const foodCategory = req.body;
  const response: Response = await FoodService.addFoodCategory(
    foodCategory,
    res,
  );
  return response;
};

export const addFoodItem2 = async (req: Request, res: Response) => {
  const foodItem = req.body;
  const foodAdded: Boolean = await FoodService.addFoodItem2(foodItem);
  if (!foodAdded) {
    return res.status(500).json({ message: "Failed to add food item" });
  }
  return res.status(201).json({ message: "Food Item Added Successfully" });
};

export const addFoodItemBulk = async (req: Request, res: Response) => {
  const foodItems = req.body;
  foodItems.forEach(async (foodItem: IFoodItem) => {
    const foodAdded: Boolean = await FoodService.addFoodItem2(foodItem);
    if (!foodAdded) {
      return res.status(500).json({ message: "Failed to add food item" });
    }
  });

  return res.status(201).json({ message: "Food Item Added Successfully" });
};

export const deleteFoodItemByName = async (req: Request, res: Response) => {
  const foodName: string = req.body.name;
  const foodDelete: Response = await FoodService.deleteFoodItemByName(
    foodName,
    res,
  );
  return foodDelete;
};

export const deleteFoodItemById = async (req: Request, res: Response) => {
  const id = req.body.id;
  const foodDelete: Response = await FoodService.deleteFoodItemById(id, res);
  return foodDelete;
};
