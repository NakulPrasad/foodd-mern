import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import store from "../../redux/store";
import Checkout from "./Checkout";

// Mock API mutations & queries
const mockPostOrder = vi.fn();
const mockValidateCoupon = vi.fn();

vi.mock("../../redux/slices/apiSlice", async () => {
  const actual = await vi.importActual("../../redux/slices/apiSlice");
  return {
    ...actual,
    usePostOrderMutation: () => [mockPostOrder, { isLoading: false }],
    useValidateCouponMutation: () => [mockValidateCoupon, { isLoading: false }],
    useGetAvailableCouponsQuery: () => ({
      data: {
        data: [
          { code: "FOODD50", title: "50% OFF up to ₹100", minOrderAmount: 199, description: "On food orders" },
        ],
      },
      isLoading: false,
    }),
  };
});

// Mock useCart hook
const mockUseCart = vi.fn();
vi.mock("../../hooks/useCart", () => ({
  useCart: () => mockUseCart(),
}));

const mockRemoveAllFromCart = vi.fn();
mockUseCart.mockReturnValue({
  cart: {
    cartItems: [
      {
        _id: "item1",
        name: "Classic Cheeseburger",
        price: 250,
        quantity: 2,
        is_veg: false,
      },
    ],
    selectedRestaurantId: "restaurant1",
    selectedRestaurantName: "The Artisan Burger Co",
    selectedRestaurantImage: "burger.jpg",
    totalPrice: 500,
    deliveryFee: 40,
    tax: 30,
    appliedCoupon: null,
    discountAmount: 0,
  },
  removeAllFromCart: mockRemoveAllFromCart,
});

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderComponent = () => {
  return render(
    <Provider store={store}>
      <MantineProvider>
        <MemoryRouter>
          <Checkout />
        </MemoryRouter>
      </MantineProvider>
    </Provider>
  );
};

describe("Checkout Page", () => {
  it("renders the checkout layout, restaurant info, and cart item breakdown", () => {
    renderComponent();
    expect(screen.getByText("Choose a Delivery Address")).toBeInTheDocument();
    expect(screen.getByText("The Artisan Burger Co")).toBeInTheDocument();
    expect(screen.getByText("Classic Cheeseburger")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("displays pricing summary including item subtotal, delivery fee, taxes, and grand total", () => {
    renderComponent();
    expect(screen.getByText("₹500")).toBeInTheDocument(); // item total
    expect(screen.getByText("₹40")).toBeInTheDocument();  // delivery
    expect(screen.getByText("₹30.00")).toBeInTheDocument();  // tax/gst
    expect(screen.getByText("₹570.00")).toBeInTheDocument(); // grand total (500 + 40 + 30.00)
  });

  it("renders coupon section and input field", () => {
    renderComponent();
    expect(screen.getByText("Coupons & Offers")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ENTER PROMO CODE/i)).toBeInTheDocument();
  });

  it("allows selecting a delivery address from the list", () => {
    renderComponent();
    
    // Select the "Home" address card
    const homeAddressCard = screen.getByText("Home").closest("div");
    expect(homeAddressCard).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Home"));
  });

  it("submits the order when proceed to pay is clicked and address is selected", async () => {
    vi.useFakeTimers();
    mockPostOrder.mockReturnValue({
      unwrap: () => Promise.resolve({ success: true }),
    });
    renderComponent();

    // Try submitting without selecting address first (button is 'Select Address First')
    const payBtn = screen.getByRole("button", { name: /Select Address First/i });
    fireEvent.click(payBtn);
    expect(mockPostOrder).not.toHaveBeenCalled();

    // Select the "Home" address by clicking its SELECT ADDRESS button
    const selectAddrBtn = screen.getAllByRole("button", { name: /SELECT ADDRESS/i })[0];
    fireEvent.click(selectAddrBtn);

    // The payment button should now be updated to "Proceed to Pay"
    const proceedPayBtn = screen.getByRole("button", { name: /Proceed To Pay/i });
    fireEvent.click(proceedPayBtn);

    // Select COD option
    const codBtn = screen.getByRole("button", { name: /COD/i });
    fireEvent.click(codBtn);

    // Click Confirm COD Order
    const confirmBtn = screen.getByRole("button", { name: /Confirm COD Order/i });
    fireEvent.click(confirmBtn);

    // Advance timers by 3000ms
    await vi.advanceTimersByTimeAsync(3000);

    expect(mockPostOrder).toHaveBeenCalledWith(expect.objectContaining({
      restaurantId: "restaurant1",
      totalAmount: 500,
      deliveryFee: 40,
      gstAndCharges: 30,
      status: "confirmed",
      paymentStatus: "pending",
      deliveryAddress: "Flat 302, Green Valley Apartments, MG Road, Bangalore 560001",
    }));

    vi.useRealTimers();
  });
});
