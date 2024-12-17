import SignInForm from "./signin-form";
import SignUpForm from "./signup-form";
import { TabSwitcher } from "@/components/tab-switcher";
import React from "react";

export default function AuthenticatePage() {
  return (
    <div className="relative flex h-screen w-full bg-background">
      <div className="max-w-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <TabSwitcher signUpTab={<SignUpForm />} signInTab={<SignInForm />} />
      </div>
    </div>
  );
}
