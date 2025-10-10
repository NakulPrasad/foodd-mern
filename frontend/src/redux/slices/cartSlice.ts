import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ICartItem } from "../../types/cart.types";

interface ICartState {
  cartItems: ICartItem[];
  totalItems: number;
  totalPrice: number;
  selectedRestaurantId: string | null;
  selectedRestaurantName: string;
}

const initialState: ICartState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  selectedRestaurantId: null,
  selectedRestaurantName: "RestaurantName",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ICartItem>) => {
      const { id, price, restaurantId, restaurantName } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      // Validate restaurant context
      if (
        state.selectedRestaurantId &&
        state.selectedRestaurantId !== restaurantId
      ) {
        toast.warning(
          "Your cart contains items from other restaurant. Please Remove to continue",
        );
        // return;
        console.error("Your cart contains items from other restaurant.");
      } else if (existingItem) {
        existingItem.quantity += 1;
        state.totalPrice += existingItem.price;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: 1,
          price: price,
        });
      }

      state.totalItems += 1;
      state.totalPrice += price;
      state.selectedRestaurantId = restaurantId;
      state.selectedRestaurantName = restaurantName;
      // console.log(state);
    },
    removeFromCart: (state, action) => {
      const { id } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
          state.totalItems -= 1;
          state.totalPrice -= existingItem.price;
        } else {
          // Remove item if quantity becomes 0
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
          state.totalItems -= 1;
          state.totalPrice -= existingItem.price;
        }
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.selectedRestaurantId = null;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
