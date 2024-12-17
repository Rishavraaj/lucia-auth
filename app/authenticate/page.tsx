import { getUser } from "@/lib/lucia";
import SignInForm from "./signin-form";
import SignUpForm from "./signup-form";
import { TabSwitcher } from "@/components/tab-switcher";
import React from "react";
import { redirect } from "next/navigation";
import GoogleSignInButton from "@/components/google-oauth-button";

export default async function AuthenticatePage() {
  const user = await getUser();
  if (user) {
    return redirect("/");
  }
  return (
    <div className="relative flex h-screen w-full bg-background">
      <div className="max-w-3xl flex flex-col gap-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <TabSwitcher signUpTab={<SignUpForm />} signInTab={<SignInForm />} />
        <GoogleSignInButton className="w-full" />
      </div>
    </div>
  );
}
