import { useState } from "react";
import { apiSlice } from "../redux/slices/apiSlice";
import { setAuth, setAuthenticationToken } from "../redux/slices/authSlice";
import store, { RootState } from "../redux/store";
import { ILoginRequest } from "../types/authentication.types";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { useCookie } from "./useCookie";
import { useUser } from "./useUser";

export const useAuth = () => {
  const { getItem, setItem } = useCookie();
  const { addUser, removeUser } = useUser();
  const [authToken] = useState(() => getItem("authToken"));
  const dispatch = useAppDispatch();

  const checkAuth = async () => {
    if (!authToken) return;
    const checkAuthResponse = await store
      .dispatch(apiSlice.endpoints.checkAuth.initiate())
      .unwrap();
    dispatch(setAuthenticationToken({ authToken: authToken }));
    if (checkAuthResponse) {
      dispatch(setAuth(checkAuthResponse));
    }
  };

  const login = (props: ILoginRequest) => {
    addUser(props.token);
  };
  const logout = () => {
    removeUser();
  };

  const isAuthenticated = ()=>{
    const user = useAppSelector((state : RootState) => state.auth.isAuthenticated)
    return user;
  }

  const setAuthToken=(token : string)=>{
    setItem("authToken", token )
  }
  return { login, logout, authToken, checkAuth, isAuthenticated, setAuthToken };
};
