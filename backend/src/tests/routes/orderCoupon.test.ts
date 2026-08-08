import { beforeAll, describe, expect, test, vi } from "vitest";

const { mockAddOrder } = vi.hoisted(() => {
  return {
    mockAddOrder: vi.fn(),
  };
});

vi.mock("../../services/orderService.js", () => {
  return {
    default: {
      getInstance: () => ({
        addOrder: mockAddOrder,
      }),
    },
  };
});

// Mock Stripe config
vi.mock("../../configs/stripeConfig.js", () => {
  return {
    default: {
      checkout: {
        sessions: {
          create: vi.fn().mockResolvedValue({
            id: "cs_test_123",
            url: "https://checkout.stripe.com/pay/cs_test_123",
          }),
        },
      },
    },
  };
});

import { addOrder, createCheckoutSession } from "../../controllers/order.controller.js";

describe("Order Controller Coupon & Stripe Integration Unit Tests", () => {
  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "test");
  });

  test("addOrder controller should pass couponCode and discountAmount to OrderService", async () => {
    mockAddOrder.mockResolvedValueOnce({ _id: "order_123" });

    let responseStatus = 0;
    let responseData: any = null;

    const req: any = {
      user: { id: "user_999" },
      body: {
        restaurantId: "rest_1",
        items: [{ foodItemId: "item_1", quantity: 2, price: 200 }],
        totalAmount: 400,
        deliveryFee: 30,
        gstAndCharges: 18,
        couponCode: "FOODD50",
        discountAmount: 100,
        status: "confirmed",
        paymentStatus: "pending",
        deliveryAddress: "123 Main St",
      },
    };

    const res: any = {
      status: (code: number) => {
        responseStatus = code;
        return {
          json: (data: any) => {
            responseData = data;
          },
        };
      },
    };

    await addOrder(req, res, () => {});

    expect(responseStatus).toBe(200);
    expect(responseData.message).toBe("OrderModel Created Successfully");
    expect(mockAddOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "user_999",
        restaurantId: "rest_1",
        couponCode: "FOODD50",
        discountAmount: 100,
      }),
    );
  });

  test("createCheckoutSession controller should create pending order with coupon details and return Stripe URL", async () => {
    mockAddOrder.mockResolvedValueOnce({ _id: "order_456" });

    let responseStatus = 0;
    let responseData: any = null;

    const req: any = {
      user: { id: "user_999", email: "test@example.com" },
      body: {
        restaurantId: "rest_1",
        items: [{ foodItemId: "item_1", quantity: 2, price: 200 }],
        totalAmount: 400,
        deliveryFee: 30,
        gstAndCharges: 18,
        deliveryAddress: "123 Main St",
        restaurantName: "Burger Hub",
        couponCode: "FLAT100",
        discountAmount: 100,
        cartItems: [{ name: "Cheeseburger", price: 200, quantity: 2 }],
      },
    };

    const res: any = {
      status: (code: number) => {
        responseStatus = code;
        return {
          json: (data: any) => {
            responseData = data;
          },
        };
      },
    };

    await createCheckoutSession(req, res);

    expect(responseStatus).toBe(200);
    expect(responseData.message).toBe("Checkout session created");
    expect(responseData.url).toContain("stripe.com");
    expect(responseData.orderId).toBe("order_456");

    expect(mockAddOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        couponCode: "FLAT100",
        discountAmount: 100,
        status: "pending",
      }),
    );
  });
});
