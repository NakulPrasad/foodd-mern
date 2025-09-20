import { Response } from "express";
import { Types } from "mongoose";
import FoodCategory, { foodCategoryInterface } from "../models/foodCategory.js";
import FoodItem, { IFoodItem } from "../models/foodModel.js";
import restaurantModel from "../models/restaurantModel.js";

/**
 * @description This class manages all the operations related to food data.
 */
export default class foodService {
  private static instance: foodService;

  private constructor() {}

  /**
   * @description get single instance of foodService.
   * @returns instance of foodService
   */

  public static getInstance(): foodService {
    if (!foodService.instance) {
      foodService.instance = new foodService();
    }
    return foodService.instance;
  }

  /**
   * @description fetches all the food items
   * @returns IFoodItem []
   */

  async getAllFoodItems(
    id: Types.ObjectId | string,
  ): Promise<boolean | IFoodItem[]> {
    try {
      const foodItems = await FoodItem.findById(id);
      if (!foodItems || foodItems.length === 0) {
        console.error("Empty Food Items");
        return false;
      }
      return foodItems;
    } catch (error: any) {
      console.error("Error while fetching food items", error.message);
      return false;
    }
  }

  /**
   * @description delete a foodItem
   * @returns IFoodItem []
   */

  async deleteFoodItemByName(
    foodName: string,
    res: Response,
  ): Promise<Response> {
    try {
      const foodItems = await FoodItem.findOneAndDelete({ name: foodName });
      if (!foodItems) {
        throw new Error("Failed to delete food Item");
      }
      return res.status(200).json({ message: "FoodItem deleted sucessfully" });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed To delete foodItem", error: error.message });
    }
  }

  /**
   * @description add foodItem
   * @returns
   */

  async addFoodItem(foodItem: IFoodItem) : Promise<boolean> {
    try {
      const restaurantId = foodItem.restaurantId
      const restaurant = await restaurantModel.findById(restaurantId);
      if(!restaurant){
        console.error("Restaurant Not Found by this id")
        return false;
      }
      restaurant.menu.push(foodItem);
      await restaurant.save();
      return true;
    } catch (error: any) {
      console.error("Error while adding food item to menu", error.message);
      return false;
    }
  }

  /**
   * Food Category
   */

  /**
   * @description fetches all the food item category
   * @returns foodCategoryInterface[]
   */

  async getAllFoodCategory(res: Response): Promise<Response> {
    const foodCategories = await FoodCategory.find({});
    if (!foodCategories) {
      return res.status(400).json({ messsage: "Cant get food Categories" });
    }
    return res
      .status(200)
      .json({ message: "getAllFoodCategory Success", data: foodCategories });
  }

  async addFoodCategory(
    food: foodCategoryInterface,
    res: Response,
  ): Promise<Response> {
    try {
      const foodCategoryAdded = await FoodCategory.create(food);
      if (!foodCategoryAdded) {
        return res.status(500).json({
          message: "Failed to add FoodCategory, invalid food category",
        });
      }
      return res
        .status(200)
        .json({ message: "Food Category Added Successfully" });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed To add FoodCategory", error: error.message });
    }
  }
}
