import { googleOAuthClient } from "@/lib/google-oauth";
import { lucia } from "@/lib/lucia";
import { db } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code || !state) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const codeVerifier = (await cookies()).get("codeVerifier")?.value;
  const cookieState = (await cookies()).get("state")?.value;
  if (!codeVerifier || !cookieState) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (state !== cookieState) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const tokens = await googleOAuthClient.validateAuthorizationCode(
    code,
    codeVerifier
  );

  const accessToken = tokens.accessToken();

  const googleResponse = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const googleData = (await googleResponse.json()) as {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  let userId: string = "";

  const existingUser = await db.user.findUnique({
    where: {
      email: googleData.email,
    },
  });

  if (existingUser) {
    userId = existingUser.id;
  } else {
    const newUser = await db.user.create({
      data: {
        email: googleData.email,
        name: googleData.name,
        picture: googleData.picture,
      },
    });
    userId = newUser.id;
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return Response.redirect(new URL("/", request.url));
}
