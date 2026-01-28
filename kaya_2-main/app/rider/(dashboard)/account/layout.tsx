"use client";
export const dynamic = "force-dynamic";
import NavLink from "@/components/Navlink";
import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";

const ACCOUNT_LINKS = [
  {
    title: "Profile Settings",
    url: "settings",
  },
  {
    title: "Bank details",
    url: "bank-details",
  },

  {
    title: "Verification",
    url: "verification",
  },
  {
    title: "Earnings",
    url: "earnings",
  },
  {
    title: "Privacy & security",
    url: "privacy-and-security",
  },
];

export default function AccountLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <div className="flex items-center mt-11 border-b border-b-foreground/20 w-[90%] mx-auto overflow-x-auto no-scrollbar">
        {ACCOUNT_LINKS.map((link) => (
          <NavLink
            key={link.url}
            href={`/rider/account/${link.url}`}
            className="block px-4">
            {({ isActive }) => (
              <div
                className={cn(
                  "relative h-full inline-flex items-center justify-center whitespace-nowrap rounded-sm_ px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-foreground shadow-sm after:w-0",
                  isActive &&
                    "after:absolute after:h-[2px] after:bottom-0 after:bg-primary/60 after:w-full after:transition-all after:duration-300 after:ease-in-out"
                )}>
                {link.title}
              </div>
            )}
          </NavLink>
        ))}
      </div>
      {children}
    </div>
  );
}
