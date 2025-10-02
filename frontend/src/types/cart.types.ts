export interface IValue {
  label: string;
  price: number;
}

export interface ICartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  image_url?: string;
  rating?: number;
  is_veg?: boolean;
  options: any;
  quantity: number;
}
