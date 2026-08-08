export const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://foodd-mern-backend.vercel.app/apiv1'
    : 'http://localhost:3000/apiv1');

const URLs = {
  // AUTH
  checkAuth: `${BASE_URL}/auth/check`,
  googleAuth: `${BASE_URL}/auth/google`,

  // User
  getLocation: `${BASE_URL}/home/getLocation`,
  loginUser: `${BASE_URL}/user/login`,
  addUser: `${BASE_URL}/user/addUser`,

  // Restraunts
  getAllRestaurant: `${BASE_URL}/restaurant/getAllRestaurant`,
  getRestaurantById: `${BASE_URL}/restaurant/getRestaurantById`,
  addRestaurant: `${BASE_URL}/restaurant/addRestaurant`,

  // Food
  getFoodData: `${BASE_URL}/food/getAllFoodItems`,
  getAllFoodCategory: `${BASE_URL}/food/getAllFoodCategory`,

  // Orders
  postOrder: `${BASE_URL}/order/addOrder`,
  getOrders: `${BASE_URL}/order/getMyOrders`,
  createCheckoutSession: `${BASE_URL}/order/create-checkout-session`,
  verifyPayment: `${BASE_URL}/order/verify-payment`,

  // Coupons
  getAvailableCoupons: `${BASE_URL}/coupon/available`,
  validateCoupon: `${BASE_URL}/coupon/validate`,
}


export default URLs
