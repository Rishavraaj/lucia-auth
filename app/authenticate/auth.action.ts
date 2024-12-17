"use server";

import { db } from "@/lib/prisma";
import { signUpSchema } from "./signup-form";
import { z } from "zod";

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
  } catch (error) {
    console.error(error);
  }
};
