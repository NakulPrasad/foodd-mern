import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ICartItem } from "../../types/cart.types";

export interface IAppliedCoupon {
  code: string;
  title?: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  maxDiscount?: number | null;
  minOrderAmount?: number;
}

interface ICartState {
  cartItems: ICartItem[];
  totalItems: number;
  totalPrice: number;
  selectedRestaurantId: string | null;
  selectedRestaurantName: string;
  selectedRestaurantImage: string | null;
  tax: number;
  deliveryFee: number;
  appliedCoupon: IAppliedCoupon | null;
  discountAmount: number;
}

const initialState: ICartState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  selectedRestaurantId: null,
  selectedRestaurantName: "{RestaurantName}",
  selectedRestaurantImage: null,
  tax: 0,
  deliveryFee: 0,
  appliedCoupon: null,
  discountAmount: 0,
};

const updateDiscountForSubtotal = (state: ICartState) => {
  if (!state.appliedCoupon) {
    state.discountAmount = 0;
    return;
  }

  const { minOrderAmount = 0, discountType, discountValue, maxDiscount } = state.appliedCoupon;

  if (state.totalPrice < minOrderAmount) {
    state.appliedCoupon = null;
    state.discountAmount = 0;
    toast.info(`Coupon removed as cart subtotal dropped below ₹${minOrderAmount}`);
    return;
  }

  let calc = 0;
  if (discountType === "percentage") {
    calc = (state.totalPrice * discountValue) / 100;
    if (maxDiscount && maxDiscount > 0) {
      calc = Math.min(calc, maxDiscount);
    }
  } else if (discountType === "flat") {
    calc = Math.min(discountValue, state.totalPrice);
  }

  state.discountAmount = Math.round(calc * 100) / 100;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ICartItem>) => {
      const { _id, price, restaurantId, restaurantName, restaurantImage } = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === _id);

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
      if (restaurantImage) {
        state.selectedRestaurantImage = restaurantImage;
      }
      state.deliveryFee = state.totalPrice > 200 ? 0 : 30;
      state.tax = state.totalPrice * 0.18;

      updateDiscountForSubtotal(state);
    },
    removeFromCart: (state, action) => {
      const { _id } = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === _id);

      if (!existingItem) return;

      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        // Remove item if quantity becomes 0
        state.cartItems = state.cartItems.filter((item) => item._id !== _id);
      }
      state.totalItems -= 1;
      state.totalPrice -= existingItem.price;

      state.deliveryFee = state.totalPrice > 200 ? 0 : 30;
      state.tax = state.totalPrice * 0.18;

      if (state.cartItems.length === 0) {
        Object.assign(state, initialState);
      } else {
        updateDiscountForSubtotal(state);
      }
    },

    applyCoupon: (
      state,
      action: PayloadAction<{ coupon: IAppliedCoupon; discountAmount: number }>,
    ) => {
      state.appliedCoupon = action.payload.coupon;
      state.discountAmount = action.payload.discountAmount;
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
    },

    clearCart: (state) => {
      Object.assign(state, initialState);
    },

    replaceCartWithItem: (state, action: PayloadAction<ICartItem>) => {
      const { price, restaurantId, restaurantName, restaurantImage } = action.payload;
      state.cartItems = [{ ...action.payload, quantity: 1, price }];
      state.totalItems = 1;
      state.totalPrice = price;
      state.selectedRestaurantId = restaurantId;
      state.selectedRestaurantName = restaurantName;
      if (restaurantImage) {
        state.selectedRestaurantImage = restaurantImage;
      }
      state.deliveryFee = price > 200 ? 0 : 30;
      state.tax = price * 0.18;
      state.appliedCoupon = null;
      state.discountAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, applyCoupon, removeCoupon, clearCart, replaceCartWithItem } =
  cartSlice.actions;
export default cartSlice.reducer;
