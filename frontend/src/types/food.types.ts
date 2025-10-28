import { IValue } from "./cart.types";

export interface IFoodItem {
  _id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
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
      values: IValue[];
    },
  ];
}

// export interface IFoodOption {
//   name: string;
//   type: string;
//   values: IValue[];
// }
