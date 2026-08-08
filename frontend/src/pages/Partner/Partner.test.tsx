import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Partner from "./Partner";

describe("Partner Page", () => {
  it("renders partner registration controls and CTA buttons", () => {
    render(
      <MantineProvider>
        <Partner />
      </MantineProvider>
    );
    expect(screen.getByRole("button", { name: /Register your restaurant/i })).toBeInTheDocument();
  });
});
