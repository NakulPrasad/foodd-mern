export interface ICoupon{
    id: string;
    restaurantId : string,
    title: string;
    description: string;
    discount_type: "percentage" | "flat" | "delivery" | "bogo"; // Assuming "flat" could be another type.
    discount_value: number | null;
    max_discount: number | null;
    min_order_value: number | null;
    validity: {
      start_date: string; // Format: YYYY-MM-DD
      end_date: string;   // Format: YYYY-MM-DD
    };
    applicable_on: string[]; // Categories like food, drinks, etc.
    usage_limit_per_user: number;
    is_new_user_only?: boolean
    days_of_week?: string[]
  }
  