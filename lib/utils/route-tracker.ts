"use client";
export const dynamic = "force-dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function RouteTracker() {
  const pathname = usePathname();
  useEffect(() => {
    console.log("Last visited path:", pathname);
    localStorage.setItem("lastVisitedPath", pathname);
  }, [pathname]);

  return null;
}
