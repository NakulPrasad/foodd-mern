import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import NavBar from "../NavBar/NavBar";
import TopAnnouncementBar from "../TopAnnouncementBar/TopAnnouncementBar";

/**
 * Displays navbar in other components and handles google authentication
 * @remarks 
 * @returns Navbar, Outlet component
 */
const Root = () => {
  /**
   * @remarks Get authentication token when redirected from google auth.
   */
  const { checkAuth, setAuthToken } = useAuth();
  const [queryParameters] = useSearchParams();
  useEffect(() => {
    // const params = new URLSearchParams(window.location.search);
    // const token = params.get("token");
    const token = queryParameters.get("token");

    if (token) {
      setAuthToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    checkAuth();
  }, []);

  return (
    <>
      <TopAnnouncementBar />
      <NavBar />
      <Outlet />
    </>
  );
};

export default Root;
