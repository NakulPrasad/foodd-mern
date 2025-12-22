import { IUserProfile } from "./profile.types";

// For the login API request
export interface ILoginRequest {
  email: string;
  password: string;
  token?:string;
}

// For the login API response
export interface ILoginResponse {
  authToken: string; // JWT or session token
  user: IUserProfile
}

// For the registration API request
export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

// For the registration API response
export interface IRegisterResponse {
  message: string; // e.g., "User registered successfully"
}

export interface ICheckAuthResponse {
  message: string;
  user: IUserProfile;
}