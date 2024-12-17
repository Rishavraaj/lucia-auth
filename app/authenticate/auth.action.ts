"use server";

import { signUpSchema } from "./signup-form";
import { z } from "zod";

export const signUp = async (data: z.infer<typeof signUpSchema>) => {
  console.log(data);
};
