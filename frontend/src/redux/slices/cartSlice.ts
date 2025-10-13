import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ICartItem } from "../../types/cart.types";

interface ICartState {
  cartItems: ICartItem[];
  totalItems: number;
  totalPrice: number;
  selectedRestaurantId: string | null;
  selectedRestaurantName: string;
  tax: number;
  deliveryFee: number;
}

const initialState: ICartState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  selectedRestaurantId: null,
  selectedRestaurantName: "{RestaurantName}",
  tax: 0,
  deliveryFee: 0,
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
        console.error("Your cart contains items from other restaurant.");
        return;
      }

      if (existingItem) {
        existingItem.quantity += 1;
        // state.totalPrice += existingItem.price;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: 1,
          price: price,
        });
      }

      state.totalPrice += price;
      state.totalItems += 1;
      state.selectedRestaurantId = restaurantId;
      state.selectedRestaurantName = restaurantName;
      state.deliveryFee = state.totalPrice > 200 ? 0 : 30;
      state.tax = state.totalPrice * 0.18;
      // console.log(state);
    },
    removeFromCart: (state, action) => {
      const { id } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (!existingItem) return;

      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        // state.totalItems -= 1;
        // state.totalPrice -= existingItem.price;
      } else {
        // Remove item if quantity becomes 0
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
      }
      state.totalItems -= 1;
      state.totalPrice -= existingItem.price;

      state.deliveryFee = state.totalPrice > 200 ? 0 : 30;
      state.tax = state.totalPrice * 0.18;

      if (state.cartItems.length === 0) {
        clearCart();
      }
    },

    clearCart: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
