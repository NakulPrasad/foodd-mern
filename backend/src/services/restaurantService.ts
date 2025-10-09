import { Types } from "mongoose";
import RestaurantModel, { IRestaurant } from "../models/restaurantModel.js";
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
      const restaurants = await RestaurantModel.find({});
      if(!restaurants || restaurants.length === 0){
            console.error("Empty RestaurantModel")
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
      const restaurant = await RestaurantModel.findById(id).populate("menu").exec();;
      if(!restaurant){
          console.error("RestaurantModel Not Found by this id")
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
      const restaurantAdded = await RestaurantModel.create(restaturant);
      if(!restaurantAdded){
          console.error("Can't Add RestaurantModel")
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
      const restaurantRemoved = await RestaurantModel.findByIdAndRemove(id);
      if(!restaurantRemoved){
          console.error("Can't remove RestaurantModel")
          return false
      }
      return true;

    } catch (error: any) {
      console.error("Error while removing restaurant", error.message);
      return false;
    }
  }

    async getRestaurantMenuById(id: Types.ObjectId | string): Promise<boolean | Types.ObjectId[]> {
    try {
      const restaurant = await RestaurantModel.findById(id).populate("menu").exec();
      if(!restaurant){
          console.error("RestaurantModel Not Found by this id")
          return false;
      }
      console.log(JSON.stringify(restaurant, null, 2));
      return restaurant.menu;

    } catch (error: any) {
      console.error("Error while fetching restaurant by id", error.message);
      return false;
    }
  }


}
