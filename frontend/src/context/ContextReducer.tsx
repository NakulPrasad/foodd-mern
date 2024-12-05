import React, { createContext, ReactNode, useContext, useReducer } from "react";

interface CartItem {
  id: string;
  name: string;
  qty: number;
  size: string;
  price: number;
  img: string;
}

interface AddAction {
  type: "ADD";
  id: string;
  name: string;
  qty: number;
  size: string;
  price: number;
  img: string;
}

interface RemoveAction {
  type: "REMOVE";
  index: number;
}

interface UpdateAction {
  type: "UPDATE";
  id: string;
  qty: number;
  price: number;
}

interface DropAction {
  type: "DROP";
}

type CartAction = AddAction | RemoveAction | UpdateAction | DropAction;

const CartStateContext = createContext<CartItem[]>([]);
const CartDispatchContext = createContext<React.Dispatch<CartAction>>(() => {});

const reducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          qty: action.qty,
          size: action.size,
          price: action.price,
          img: action.img,
        },
      ];
    case "REMOVE":
      const newArr = [...state];
      newArr.splice(action.index, 1);
      return newArr;
    case "UPDATE":
      const arr = [...state];
      arr.find((food, index) => {
        if (food.id === action.id) {
          arr[index] = {
            ...food,
            qty: action.qty + food.qty,
            price: action.price + food.price,
          };
        }
      });
      return arr;
    case "DROP":
      return [];
    default:
      console.error("Error Occurred in Reducer");
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(reducer, []);
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

// The custom hooks for accessing the context
export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
