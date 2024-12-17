"use server";

import { db } from "@/lib/prisma";
import { signUpSchema } from "./signup-form";
import { z } from "zod";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";

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
