import { BASE_URL } from "../configs/env.js";

/**
 * @description Contains all the URLs used throught application.
 */

const URLs = {
  getFoodData: `${BASE_URL}/apiv1/food/getAllFoodItems`,
  getAllFoodCategory: `${BASE_URL}/food/getAllFoodCategory`,
  loginUser: `${BASE_URL}/user/login/apiv1/user/getMyDetails`,
  postOrder: `${BASE_URL}/order/orderCheckout`,
  getMyOrders: `${BASE_URL}/order/getMyOrders`,
  addUser: `${BASE_URL}/user/addUser`,
};

export default URLs;
