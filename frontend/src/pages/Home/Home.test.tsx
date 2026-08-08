import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./Home";

vi.mock("../City/City", () => ({
  default: () => <div data-testid="mock-city">City Home Mock</div>,
}));

describe("Home Page Wrapper", () => {
  it("renders City subcomponent layout inside Home", () => {
    render(<Home />);
    expect(screen.getByTestId("mock-city")).toBeInTheDocument();
  });
});
