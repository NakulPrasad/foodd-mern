import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Auth from "./Auth";

describe("Auth Page (OAuth Mock)", () => {
  it("renders OAuth instructions and login trigger button", () => {
    render(<Auth />);
    expect(screen.getByText("Google Authentication with Passport.js")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login with Google/i })).toBeInTheDocument();
  });
});
