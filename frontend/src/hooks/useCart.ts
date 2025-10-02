import { addToCart, removeFromCart } from "../redux/slices/cartSlice";
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

  const currentRestaurant = useAppSelector(
    (state: RootState) => state.cart.selectedRestaurant,
  );

  const cart = useAppSelector((state: RootState) => state.cart);
  const {cartItems, price, totalItems} = useAppSelector((state: RootState) => state.cart);

  return { addItem, removeItem, currentRestaurant, cart, cartItems, price, totalItems };
};
