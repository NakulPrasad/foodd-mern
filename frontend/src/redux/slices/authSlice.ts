import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserProfile } from "../../types/profile.types";

interface authState {
    isAuthenticated ?: boolean;
    user: IUserProfile | null;
    authToken ?: string | null;
}

const initialState : authState = {
    isAuthenticated: false,
    user : null,
    authToken : null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action:PayloadAction<authState>) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        setAuthenticated : (state)=>{
            state.isAuthenticated = true;
        },
        setAuthenticationToken : (state, action:PayloadAction<{authToken :string}>)=>{
            state.authToken = action.payload.authToken;
        },
    },
});
export const { setAuth, clearAuth, setAuthenticated, setAuthenticationToken } = authSlice.actions;
export default authSlice.reducer;
