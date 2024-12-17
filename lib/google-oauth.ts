import { Google } from "arctic";

export const googleOAuthClient = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI! + "/api/auth/google/callback"
);
