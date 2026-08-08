import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import store from "../../redux/store";
import { setAuth } from "../../redux/slices/authSlice";
import Profile from "./Profile";

describe("Profile Page", () => {
  it("renders profile name and email coordinates details", () => {
    store.dispatch(
      setAuth({
        user: {
          name: "Nakul Prasad Mahato",
          email: "nakulprasad10@gmail.com",
          displayName: "Nakul",
        },
      })
    );

    render(
      <Provider store={store}>
        <MantineProvider>
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        </MantineProvider>
      </Provider>
    );
    expect(screen.getByText("Nakul Prasad Mahato")).toBeInTheDocument();
    expect(screen.getByDisplayValue("nakulprasad10@gmail.com")).toBeInTheDocument();
  });
});
