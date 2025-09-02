export interface GoogleOAuthLoginRequest {
  user: {
    id: any;
    displayName: any;
    emails: { value: any }[];
    photos: { value: any }[];
  };
}
