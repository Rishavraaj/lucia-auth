"use server";

import { db } from "@/lib/prisma";
import { signUpSchema } from "./signup-form";
import { z } from "zod";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { signInSchema } from "./signin-form";
import { redirect } from "next/navigation";
import { googleOAuthClient } from "@/lib/google-oauth";
import { generateCodeVerifier, generateState } from "arctic";

export const signUp = async (data: z.infer<typeof signUpSchema>) => {
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return {
        error: "User already exists",
        success: false,
      };
    }

    const hashedPassword = await new Argon2id().hash(data.password);

    const user = await db.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
        hashedPassword,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Something went wrong",
      success: false,
    };
  }
};

export const signIn = async (data: z.infer<typeof signInSchema>) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user || !user.hashedPassword) {
      return {
        error: "Invalid credentials",
        success: false,
      };
    }

    const passwordValid = await new Argon2id().verify(
      user.hashedPassword,
      data.password
    );

    if (!passwordValid) {
      return {
        error: "Invalid credentials",
        success: false,
      };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Something went wrong",
      success: false,
    };
  }
};

export const signOut = async () => {
  const session = await lucia.createBlankSessionCookie();
  (await cookies()).set(session.name, session.value, session.attributes);
  return redirect("/authenticate");
};

export const googleOAuthConsentUrl = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    (await cookies()).set("codeVerifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });
    (await cookies()).set("state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    const authUrl = googleOAuthClient.createAuthorizationURL(
      state,
      codeVerifier,
      ["email", "profile", "openid"]
    );

    return {
      success: true,
      url: authUrl.toString(),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }
};
