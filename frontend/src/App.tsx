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
import Auth from "./pages/Auth/Auth";
import Checkout from "./pages/Checkout/Checkout";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";
import Order from "./pages/Order/Order";
import Partner from "./pages/Partner/Partner";
import Profile from "./pages/Profile/Profile";
import Restaurant from "./pages/Restaurant/Restaurant";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess";
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

  return isAuthenticated ? element : <Navigate to="/" />;
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
    // /payment-success must NOT be inside PrivateRoute —
    // Stripe's redirect resets the Redux store, so isAuthenticated
    // would be false on landing. The component handles auth itself.
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
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
      <MantineProvider theme={Theme} defaultColorScheme="auto">
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>
  );
}

export default App;
