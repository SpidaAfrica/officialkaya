"use client";
export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Splash from "../components/Splash";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      redirect("/auth/signin");
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);
  return <Splash />;
}
