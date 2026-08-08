import { apiSlice } from "../redux/slices/apiSlice";
import { clearAuth, setAuth, setAuthenticationToken } from "../redux/slices/authSlice";
import store, { RootState } from "../redux/store";
import { ILoginRequest } from "../types/authentication.types";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { useCookie } from "./useCookie";
import { useUser } from "./useUser";

export const useAuth = () => {
  const { getItem, setItem } = useCookie();
  const { addUser, removeUser } = useUser();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state: RootState) => !!state.auth.isAuthenticated,
  );
  const user = useAppSelector((state: RootState) => state.auth.user);
  const reduxAuthToken = useAppSelector(
    (state: RootState) => state.auth.authToken,
  );
  const authToken = reduxAuthToken || getItem("authToken");

  const checkAuth = async () => {
    const token = getItem("authToken");
    if (!token) return;

    // 1. Dispatch token to Redux FIRST so fetchBaseQuery includes Bearer header
    dispatch(setAuthenticationToken({ authToken: token }));

    try {
      // 2. Query backend /apiv1/auth/check
      const checkAuthResponse = await store
        .dispatch(apiSlice.endpoints.checkAuth.initiate())
        .unwrap();

      if (checkAuthResponse && checkAuthResponse.user) {
        dispatch(setAuth({ user: checkAuthResponse.user, isAuthenticated: true }));
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      dispatch(clearAuth());
      removeUser();
    }
  };

  const login = (props: ILoginRequest) => {
    addUser(props.token);
    if (props.token) {
      dispatch(setAuthenticationToken({ authToken: props.token }));
      checkAuth();
    }
  };

  const logout = () => {
    removeUser();
    dispatch(clearAuth());
  };

  const setAuthToken = (token: string) => {
    setItem("authToken", token);
    dispatch(setAuthenticationToken({ authToken: token }));
  };

  return { login, logout, authToken, checkAuth, isAuthenticated, user, setAuthToken };
};
