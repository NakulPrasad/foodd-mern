import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Profile from "./Profile";

describe("Profile Page", () => {
  it("renders profile name and email coordinates details", () => {
    render(
      <MantineProvider>
        <Profile />
      </MantineProvider>
    );
    expect(screen.getByText("Nakul Prasad Mahato")).toBeInTheDocument();
    expect(screen.getByText(/nakulprasad10@gmail.com/i)).toBeInTheDocument();
  });
});
