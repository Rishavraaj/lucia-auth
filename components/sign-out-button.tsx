"use client";
import React from "react";
import { Button } from "./ui/button";
import { signOut } from "@/app/authenticate/auth.action";

export function SignOutButton({ children }: { children: React.ReactNode }) {
  return <Button onClick={() => signOut()}>{children}</Button>;
}

export default SignOutButton;
