import { Types } from "mongoose";
import Restaurant, { IRestaurant } from "../models/restaurantModel.js";
import { Response } from "express";


export default class restaurantService {
  private static instance: restaurantService;

  private constructor() {}

  public static getInstance(): restaurantService {
    if (!restaurantService.instance) {
      restaurantService.instance = new restaurantService();
    }
    return restaurantService.instance;
  }

  async getAllRestaurant(): Promise<boolean | IRestaurant[]> {
    try {
      const restaurants = await Restaurant.find({});
      if(!restaurants || restaurants.length === 0){
            console.error("Empty Restaurant")
          return false;
      }
      return restaurants;

    } catch (error: any) {
      console.error("Error while fetching restaurant", error.message);
      return false;
    }
  }

  async getRestaurantById(id: Types.ObjectId | string): Promise<boolean | IRestaurant> {
    try {
      const restaurant = await Restaurant.findById(id);
      if(!restaurant){
          console.error("Restaurant Not Found by this id")
          return false;
      }
      return restaurant;

    } catch (error: any) {
      console.error("Error while fetching restaurant by id", error.message);
      return false;
    }
  }

  async registerRestaurant(restaturant : IRestaurant): Promise<boolean> {
    try {
      const restaurantAdded = await Restaurant.create(restaturant);
      if(!restaurantAdded){
          console.error("Can't Add Restaurant")
          return false
      }
      return true;

    } catch (error: any) {
      console.error("Error while adding restaurant", error.message);
      return false;
    }
  }

  async removeRestaurant(id: Types.ObjectId): Promise<boolean> {
    try {
      const restaurantRemoved = await Restaurant.findByIdAndRemove(id);
      if(!restaurantRemoved){
          console.error("Can't remove Restaurant")
          return false
      }
      return true;

    } catch (error: any) {
      console.error("Error while removing restaurant", error.message);
      return false;
    }
  }


}
