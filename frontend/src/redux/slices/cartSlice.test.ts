import { describe, expect, it } from "vitest";
import cartReducer, {
  addToCart,
  applyCoupon,
  removeCoupon,
  removeFromCart,
} from "./cartSlice";

const mockItem1: any = {
  _id: "item1",
  restaurantId: "rest1",
  restaurantName: "Tasty Treats",
  name: "Burger",
  price: 200,
  quantity: 1,
  category: "Fast Food",
  is_veg: true,
};

const mockItem2: any = {
  _id: "item2",
  restaurantId: "rest1",
  restaurantName: "Tasty Treats",
  name: "Fries",
  price: 100,
  quantity: 1,
  category: "Sides",
  is_veg: true,
};

describe("cartSlice Reducer Tests", () => {
  it("should handle initial state", () => {
    const state = cartReducer(undefined, { type: "unknown" });
    expect(state.cartItems).toEqual([]);
    expect(state.totalPrice).toBe(0);
    expect(state.appliedCoupon).toBeNull();
    expect(state.discountAmount).toBe(0);
  });

  it("should apply a percentage coupon and set discountAmount", () => {
    let state = cartReducer(undefined, addToCart(mockItem1)); // totalPrice = 200
    state = cartReducer(
      state,
      applyCoupon({
        coupon: {
          code: "FOODD50",
          discountType: "percentage",
          discountValue: 50,
          maxDiscount: 100,
          minOrderAmount: 199,
        },
        discountAmount: 100,
      }),
    );

    expect(state.appliedCoupon?.code).toBe("FOODD50");
    expect(state.discountAmount).toBe(100);
  });

  it("should remove coupon when removeCoupon is dispatched", () => {
    let state = cartReducer(undefined, addToCart(mockItem1));
    state = cartReducer(
      state,
      applyCoupon({
        coupon: {
          code: "FOODD50",
          discountType: "percentage",
          discountValue: 50,
          maxDiscount: 100,
          minOrderAmount: 199,
        },
        discountAmount: 100,
      }),
    );
    state = cartReducer(state, removeCoupon());

    expect(state.appliedCoupon).toBeNull();
    expect(state.discountAmount).toBe(0);
  });

  it("should automatically revoke coupon if cart total drops below minOrderAmount", () => {
    let state = cartReducer(undefined, addToCart(mockItem1)); // +200 = 200
    state = cartReducer(state, addToCart(mockItem2)); // +100 = 300
    state = cartReducer(
      state,
      applyCoupon({
        coupon: {
          code: "FLAT100",
          discountType: "flat",
          discountValue: 100,
          minOrderAmount: 250,
        },
        discountAmount: 100,
      }),
    );

    expect(state.appliedCoupon?.code).toBe("FLAT100");

    // Remove mockItem2 (price 100) -> subtotal becomes 200 (< 250 minOrderAmount)
    state = cartReducer(state, removeFromCart({ _id: "item2" }));

    expect(state.totalPrice).toBe(200);
    expect(state.appliedCoupon).toBeNull();
    expect(state.discountAmount).toBe(0);
  });
});
