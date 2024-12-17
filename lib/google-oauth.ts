import { Google } from "arctic";

export const googleOAuthClient = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.NEXTAUTH_URL! + "/api/auth/google/callback"
);
