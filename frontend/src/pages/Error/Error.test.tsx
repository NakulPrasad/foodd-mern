import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Error from "./Error";

// Mock useRouteError from react-router-dom
vi.mock("react-router-dom", () => ({
  useRouteError: () => ({
    statusText: "Not Found",
    message: "Page does not exist",
  }),
}));

describe("Error Boundary Page", () => {
  it("renders Oops title and correct route error message", () => {
    render(<Error />);
    expect(screen.getByText("Oops!")).toBeInTheDocument();
    expect(screen.getByText("Sorry, an unexpected error has occurred.")).toBeInTheDocument();
    expect(screen.getByText("Not Found")).toBeInTheDocument();
  });
});
