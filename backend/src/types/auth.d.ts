import { Request } from "express";
export interface IGoogleOAuthLoginRequest {
  user: {
    id: any;
    displayName: any;
    emails: { value: any }[];
    photos: { value: any }[];
  };
}

export interface IAuthenticatedRequest extends Request {
  user: User; // required
}