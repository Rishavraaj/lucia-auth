"use server";

import { db } from "@/lib/prisma";
import { signUpSchema } from "./signup-form";
import { z } from "zod";
import { Argon2id } from "oslo/password";

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
  } catch (error) {
    console.error(error);
  }
};
