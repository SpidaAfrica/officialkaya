import ThemeToggle from "@/components/ThemeToggle";
import React, { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <div className="fixed top-4 right-6 z-50">
        <ThemeToggle />
      </div>
    </>
  );
}
