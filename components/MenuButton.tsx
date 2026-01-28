"use client";
export const dynamic = "force-dynamic";
import { Menu } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

export default function MainMenuButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleClick = useCallback(() => {
    const menu = searchParams.get("menu");
    router.replace(
      pathname +
        "?" +
        createQueryString("menu", menu === "true" ? "false" : "true")
    );
  }, [createQueryString, pathname, router, searchParams]);

  return (
    <button onClick={handleClick} className="w-fit ml-3 lg:hidden">
      <Menu className="text-primary w-8 h-8" />
    </button>
  );
}
