export let BASE_URL = 'http://localhost:3000/apiv1'
if (process.env.NODE_ENV === 'production') {
  BASE_URL =
    process.env.VITE_BASE_URL || 'https://foodd-mern-backend.vercel.app/apiv1'
}

const URLs = {
  // AUTH
  checkAuth: `${BASE_URL}/auth/check`,
  googleAuth : `${BASE_URL}/auth/google`,

  // User
  getLocation : `${BASE_URL}/home/getLocation`,
  loginUser: `${BASE_URL}/user/login`,
  addUser: `${BASE_URL}/user/addUser`,

  // Restraunts
  getAllRestaurant : `${BASE_URL}/restaurant/getAllRestaurant`,
  getRestaurantById : `${BASE_URL}/restaurant/getRestaurantById`,
  addRestaurant : `${BASE_URL}/restaurant/addRestaurant`,
  
  // Food
  getFoodData: `${BASE_URL}/food/getAllFoodItems`,
  getAllFoodCategory: `${BASE_URL}/food/getAllFoodCategory`,
  
  // Orders
  postOrder: `${BASE_URL}/order/orderCheckout`,
  getOrders: `${BASE_URL}/order/getMyOrders`,
  
  
  
}


export default URLs
