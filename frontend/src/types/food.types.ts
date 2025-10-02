// import { IValue } from "./cart.types";

export interface IFoodItem {
  name: string;
  restaurantId: string;
  restaurntName: string;
  description: string;
  price: number;
  category: string;
  img_url: string;
  rating: number;
  is_veg: boolean;
  options: [
    {
      name: string;
      type: string;
      values: [string];
    },
  ];
}

// export interface IFoodOption {
//   name: string;
//   type: string;
//   values: IValue[];
// }