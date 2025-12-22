import {
  addToCart,
  clearCart,
  removeFromCart,
} from "../redux/slices/cartSlice";
import { RootState } from "../redux/store";
import { ICartItem } from "../types/cart.types";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useCart = () => {
  const dispatch = useAppDispatch();

  const addItem = (cartItem: ICartItem) => {
    dispatch(addToCart(cartItem));
  };

  const removeItem = (cartItem: ICartItem) => {
    dispatch(removeFromCart(cartItem));
  };

  const removeAllFromCart = () => {
    dispatch(clearCart());
  };

  const cart = useAppSelector((state: RootState) => state.cart);

  const currentRestaurant = useAppSelector(
    (state: RootState) => state.cart.selectedRestaurantId,
  );

  // const currentRestaurantName = useAppSelector(
  //   (state: RootState) => state.cart.selectedRestaurantName,
  // );

  const { cartItems, totalPrice, totalItems } = useAppSelector(
    (state: RootState) => state.cart,
  );

  return {
    addItem,
    removeItem,
    removeAllFromCart,
    currentRestaurant,
    cart,
    cartItems,
    totalPrice,
    totalItems,
  };
};
