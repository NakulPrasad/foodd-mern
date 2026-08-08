import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import NavBar from "../NavBar/NavBar";
import TopAnnouncementBar from "../TopAnnouncementBar/TopAnnouncementBar";

/**
 * Displays navbar in other components and handles google authentication
 */
const Root = () => {
  const { checkAuth, setAuthToken } = useAuth();
  const [queryParameters] = useSearchParams();

  useEffect(() => {
    const token = queryParameters.get("token");
    const err = queryParameters.get("error");

    if (token) {
      setAuthToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.success("Logged in with Google successfully!");
    } else if (err) {
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.error("Google authentication failed or was cancelled.");
    }
    checkAuth();
  }, [queryParameters]);

  return (
    <>
      <TopAnnouncementBar />
      <NavBar />
      <Outlet />
    </>
  );
};

export default Root;
