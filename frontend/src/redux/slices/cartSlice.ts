import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ICartItem } from "../../types/cart.types";

interface ICartState {
  cartItems: ICartItem[];
  totalItems: number;
  price: number;
  selectedRestaurant: string | null;
}

const initialState: ICartState = {
  cartItems: [],
  totalItems: 0,
  price: 0,
  selectedRestaurant: null,
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
        state.selectedRestaurant &&
        state.selectedRestaurant !== restaurantId
      ) {
        toast.warning(
          "Your cart contains items from other restaurant. Please Remove to continue",
        );
        // return;
        throw new Error("Your cart contains items from other restaurant.");
      }

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.price += price;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: 1,
          price: price,
        });
      }

      state.totalItems += 1;
      state.price += price;
      state.selectedRestaurant = restaurantName;
      // console.log(state);
    },
    removeFromCart: (state, action) => {
      const { id, price, quantity } = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);
      state.totalItems -= quantity;
      state.price -= price * quantity;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.price = 0;
      state.selectedRestaurant = null;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
