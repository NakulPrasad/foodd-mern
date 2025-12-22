export interface IValue {
  label: string;
  price: number;
}

export interface ICartItem {
  _id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  image_url?: string;
  rating?: number;
  is_veg?: boolean;
  options: IValue;
  quantity: number;
}
