import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Root from "./components/Root/Root";
import { useAuth } from "./hooks/useAuth";
import store from "./redux/store";
import Auth from "./screens/Auth/Auth";
import Checkout from "./screens/Checkout/Checkout";
import Error from "./screens/Error/Error";
import Home from "./screens/Home/Home";
import Order from "./screens/Order/Order";
import Partner from "./screens/Partner/Partner";
import Profile from "./screens/Profile/Profile";
import Restaurant from "./screens/Restaurant/Restaurant";
import Theme from "./theme/theme";

interface PrivateRouteProps {
  element: React.ReactElement;
}

/**
 * Checks for authentication before accessing to user.
 * @param element React Component
 * @returns React Component if authenticated else redirected to /login
 */

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated() ? element : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/partner-with-us/new/",
        element: <Partner />,
      },
      {
        path: "/restaurant/:id",
        element: <Restaurant />,
      },
      {
        path: "/my-account/*",
        element: <Profile />,
      },
      {
        path: "/order/*",
        element: <Order />,
      },
    ],
  },
  {
    element: <PrivateRoute element={<Root />} />,
    errorElement: <Error />,
    children: [
      {
        path: "/checkout",
        element: <Checkout />,
      },
    ],
  },
  {
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/auth",
        element: <Auth />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <MantineProvider theme={Theme}>
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>
  );
}

export default App;
