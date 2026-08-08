import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import store from "../../redux/store";
import City from "./City";

// Mock useLocation hook
vi.mock("../../hooks/useLocation", () => ({
  useLocation: () => ({
    city: "Bangalore",
    loading: false,
    error: null,
    getLocation: vi.fn(),
  }),
}));

// Mock useRestaurant hook with custom implementation options
const mockUseRestaurant = vi.fn();
vi.mock("../../hooks/useRestaurant", () => ({
  get useRestaurant() {
    return mockUseRestaurant;
  },
}));

// Setup default mock return value
mockUseRestaurant.mockReturnValue({
  allRestaurantJson: {
    data: [
      {
        _id: "1",
        name: "Artisan Burger Co",
        rating: 4.5,
        deliveryTime: "25 Mins",
        cuisine: ["Burgers", "American"],
        location: { area: "Koramangala" },
        image: "burger.jpg",
      },
      {
        _id: "2",
        name: "Pizza Palazzo",
        rating: 3.8,
        deliveryTime: "35 Mins",
        cuisine: ["Pizza", "Italian"],
        location: { area: "Indiranagar" },
        image: "pizza.jpg",
      },
    ],
  },
  isLoading: false,
  error: null,
  setCurrentRestaurant: vi.fn(),
  removeCurrentRestaurant: vi.fn(),
});

// A wrapper helper to render components with Mantine, Redux, and Routing contexts
const renderComponent = () => {
  return render(
    <Provider store={store}>
      <MantineProvider>
        <MemoryRouter>
          <City />
        </MemoryRouter>
      </MantineProvider>
    </Provider>
  );
};

describe("Homepage (City Screen)", () => {
  it("renders the hero banner with the correct location", () => {
    renderComponent();
    expect(screen.getByText(/Order Food/i)).toBeInTheDocument();
    expect(screen.getByText("Bangalore")).toBeInTheDocument();
  });

  it("renders the list of mock restaurants loaded from the query", () => {
    renderComponent();
    expect(screen.getAllByText("Artisan Burger Co").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pizza Palazzo").length).toBeGreaterThan(0);
  });

  it("filters restaurants based on user search query input", () => {
    renderComponent();
    
    const searchInput = screen.getByPlaceholderText(/Search "Bangalore" restaurants/i);
    fireEvent.change(searchInput, { target: { value: "Palazzo" } });

    const grid = screen.getByTestId("restaurant-grid");
    expect(within(grid).getByText("Pizza Palazzo")).toBeInTheDocument();
    expect(within(grid).queryByText("Artisan Burger Co")).not.toBeInTheDocument();
  });

  it("filters restaurants by rating when Rating 4+ filter tab is selected", () => {
    renderComponent();
    
    const ratingFilterBtn = screen.getByRole("button", { name: /Rating 4\+/i });
    fireEvent.click(ratingFilterBtn);

    const grid = screen.getByTestId("restaurant-grid");
    expect(within(grid).getByText("Artisan Burger Co")).toBeInTheDocument();
    expect(within(grid).queryByText("Pizza Palazzo")).not.toBeInTheDocument();
  });

  it("displays the shimmer loading state when restaurants are fetching", () => {
    // Override useRestaurant mock for loading state
    mockUseRestaurant.mockReturnValueOnce({
      allRestaurantJson: null,
      isLoading: true,
      error: null,
      setCurrentRestaurant: vi.fn(),
      removeCurrentRestaurant: vi.fn(),
    });

    render(
      <Provider store={store}>
        <MantineProvider>
          <MemoryRouter>
            <City />
          </MemoryRouter>
        </MantineProvider>
      </Provider>
    );

    // Grid should not show restaurant card names
    expect(screen.queryByText("Artisan Burger Co")).not.toBeInTheDocument();
  });

  it("renders the error state message when query fails", () => {
    // Override useRestaurant mock for error state
    mockUseRestaurant.mockReturnValueOnce({
      allRestaurantJson: null,
      isLoading: false,
      error: { message: "Failed to fetch" },
      setCurrentRestaurant: vi.fn(),
      removeCurrentRestaurant: vi.fn(),
    });

    render(
      <Provider store={store}>
        <MantineProvider>
          <MemoryRouter>
            <City />
          </MemoryRouter>
        </MantineProvider>
      </Provider>
    );

    expect(screen.getByText("Couldn't load restaurants")).toBeInTheDocument();
  });
});
