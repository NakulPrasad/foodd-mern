import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import store from "../../redux/store";
import Order from "./Order";

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

mockUseAuth.mockReturnValue({
  user: {
    name: "Nakul Prasad Mahato",
    email: "nakulprasad10@gmail.com",
    avatarUrl: "avatar.jpg",
  },
  isAuthenticated: true,
});

// Mock useGetMyOrdersQuery query
const mockUseGetMyOrdersQuery = vi.fn();
vi.mock("../../redux/slices/apiSlice", async () => {
  const actual = await vi.importActual("../../redux/slices/apiSlice");
  return {
    ...actual,
    useGetMyOrdersQuery: () => mockUseGetMyOrdersQuery(),
  };
});

const defaultMockOrders = {
  data: {
    data: [
      {
        _id: "FD-12345",
        restaurantName: "The Artisan Burger Co",
        status: "Delivered",
        totalAmount: 320,
        createdAt: "2026-08-07T12:00:00.000Z",
        items: [
          {
            foodItemId: {
              _id: "item1",
              name: "Chicken Burger",
              price: 320,
            },
            quantity: 1,
            price: 320,
          },
        ],
      },
    ],
  },
  isLoading: false,
};

const renderComponent = () => {
  return render(
    <Provider store={store}>
      <MantineProvider>
        <MemoryRouter>
          <Order />
        </MemoryRouter>
      </MantineProvider>
    </Provider>
  );
};

describe("Orders Page", () => {
  beforeEach(() => {
    mockUseGetMyOrdersQuery.mockReturnValue(defaultMockOrders);
  });
  it("renders user profile info correctly", () => {
    renderComponent();
    expect(screen.getByText("Nakul Prasad Mahato")).toBeInTheDocument();
    expect(screen.getByText(/nakulprasad10@gmail\.com/i)).toBeInTheDocument();
  });

  it("renders user orders list correctly from query", () => {
    renderComponent();
    expect(screen.getByText("The Artisan Burger Co")).toBeInTheDocument();
    expect(screen.getByText(/-12345/i)).toBeInTheDocument();
    expect(screen.getAllByText("Delivered").length).toBeGreaterThan(0);
  });

  it("switches tabs and displays target tab layouts", () => {
    renderComponent();
    
    // Switch to Addresses tab
    const addressTabBtn = screen.getByRole("button", { name: /Saved Addresses/i });
    fireEvent.click(addressTabBtn);
    expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Work" })).toBeInTheDocument();

    // Switch to Payments tab
    const paymentsTabBtn = screen.getByRole("button", { name: /Payment Methods/i });
    fireEvent.click(paymentsTabBtn);
    expect(screen.getByText("Saved Cards & UPI")).toBeInTheDocument();

    // Switch to Coupons tab
    const couponsTabBtn = screen.getByRole("button", { name: /Offers & Coupons/i });
    fireEvent.click(couponsTabBtn);
    expect(screen.getByText("Available Vouchers & Rewards")).toBeInTheDocument();
  });

  it("falls back to production mock list when backend query data is empty", () => {
    mockUseGetMyOrdersQuery.mockReturnValue({
      data: { data: [] },
      isLoading: false,
    });

    render(
      <Provider store={store}>
        <MantineProvider>
          <MemoryRouter>
            <Order />
          </MemoryRouter>
        </MantineProvider>
      </Provider>
    );

    // Should fallback to mock list (e.g. Royal Biryani House)
    expect(screen.getByText("Royal Biryani House")).toBeInTheDocument();
    expect(screen.getByText(/984210/i)).toBeInTheDocument();
  });
});
