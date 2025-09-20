export let BASE_URL = 'http://localhost:3000/apiv1'
if (process.env.NODE_ENV === 'production') {
  BASE_URL =
    process.env.VITE_BASE_URL || 'https://foodd-mern-backend.vercel.app/apiv1'
}

const URLs = {
  getFoodData: `${BASE_URL}/food/getAllFoodItems`,
  getAllFoodCategory: `${BASE_URL}/food/getAllFoodCategory`,
  loginUser: `${BASE_URL}/user/login`,
  postOrder: `${BASE_URL}/order/orderCheckout`,
  getOrders: `${BASE_URL}/order/getMyOrders`,
  addUser: `${BASE_URL}/user/addUser`,
  checkAuth: `${BASE_URL}/auth/check`,
  getLocation : `${BASE_URL}/home/getLocation`,
  googleAuth : `${BASE_URL}/auth/google`
}


export default URLs
