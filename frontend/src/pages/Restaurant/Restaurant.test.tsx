import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import store from "../../redux/store";
import Restaurant from "./Restaurant";

// Mock useParams to return id: "test-id"
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "test-id" }),
    useNavigate: () => vi.fn(),
  };
});

// Mock apiSlice query
const mockUseGetRestaurantByIdQuery = vi.fn();
vi.mock("../../redux/slices/apiSlice", async () => {
  const actual = await vi.importActual("../../redux/slices/apiSlice");
  return {
    ...actual,
    useGetRestaurantByIdQuery: (...args: any[]) => mockUseGetRestaurantByIdQuery(...args),
  };
});

// Mock useCart hook
const mockUseCart = vi.fn();
vi.mock("../../hooks/useCart", () => ({
  useCart: () => mockUseCart(),
}));

mockUseCart.mockReturnValue({
  cart: {
    cartItems: [],
    totalPrice: 0,
    totalItems: 0,
  },
  addItem: vi.fn(),
  removeItem: vi.fn(),
});

// Setup mock return for restaurant data
mockUseGetRestaurantByIdQuery.mockReturnValue({
  data: {
    data: {
      _id: "test-id",
      name: "The Artisan Burger Co",
      image: "burger.jpg",
      rating: 4.8,
      deliveryTime: "30 Mins",
      location: { area: "Koramangala" },
      menu: [
        {
          _id: "m1",
          name: "Classic Cheeseburger",
          price: 250,
          category: "Burgers",
          is_veg: false,
          img_url: "burger1.jpg",
          description: "Juicy beef patty with cheese",
        },
        {
          _id: "m2",
          name: "Veggie Burger",
          price: 220,
          category: "Burgers",
          is_veg: true,
          img_url: "burger2.jpg",
          description: "Plant-based patty burger",
        },
      ],
    },
  },
  isLoading: false,
});

const renderComponent = () => {
  return render(
    <Provider store={store}>
      <MantineProvider>
        <MemoryRouter initialEntries={["/restaurant/test-id"]}>
          <Routes>
            <Route path="/restaurant/:id" element={<Restaurant />} />
          </Routes>
        </MemoryRouter>
      </MantineProvider>
    </Provider>
  );
};

describe("Restaurant Page", () => {
  it("renders restaurant header and cover metadata details", () => {
    renderComponent();
    expect(screen.getAllByText("The Artisan Burger Co").length).toBeGreaterThan(0);
    expect(screen.getByText("Koramangala")).toBeInTheDocument();
    expect(screen.getAllByText("4.8").length).toBeGreaterThan(0);
  });

  it("groups menu items by category and renders categories and food cards", () => {
    renderComponent();
    // Accordion categories (split spans)
    expect(screen.getAllByText("Burgers").length).toBeGreaterThan(0);
    expect(screen.getByText("(2)")).toBeInTheDocument();
    // Food items within the accordion
    expect(screen.getByText("Classic Cheeseburger")).toBeInTheDocument();
    expect(screen.getByText("Veggie Burger")).toBeInTheDocument();
  });

  it("searches menu items correctly based on search query input", () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Search for dishes.../i);
    fireEvent.change(searchInput, { target: { value: "Veggie" } });

    expect(screen.getByText("Veggie Burger")).toBeInTheDocument();
    expect(screen.queryByText("Classic Cheeseburger")).not.toBeInTheDocument();
  });

  it("displays sticky cart bar at the bottom when cart has items", () => {
    mockUseCart.mockReturnValueOnce({
      cart: {
        cartItems: [
          {
            _id: "m1",
            name: "Classic Cheeseburger",
            price: 250,
            quantity: 1,
          },
        ],
        totalPrice: 250,
        totalItems: 1,
      },
      addItem: vi.fn(),
      removeItem: vi.fn(),
    });

    render(
      <Provider store={store}>
        <MantineProvider>
          <MemoryRouter initialEntries={["/restaurant/test-id"]}>
            <Routes>
              <Route path="/restaurant/:id" element={<Restaurant />} />
            </Routes>
          </MemoryRouter>
        </MantineProvider>
      </Provider>
    );

    expect(screen.getByText("1 item")).toBeInTheDocument();
    expect(screen.getByText("View Cart · ₹250 →")).toBeInTheDocument();
  });
});
