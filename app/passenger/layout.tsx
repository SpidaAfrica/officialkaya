"use client";
export const dynamic = "force-dynamic";
import RouteTracker from "@/lib/utils/route-tracker";
import React, { PropsWithChildren } from "react";
import { AppLayout } from "../layouts/app-layout";

export default function _AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <RouteTracker />
      <div className="h-svh flex flex-col">
        <main className=" overflow-auto">
          <AppLayout>{children}</AppLayout>
        </main>
      </div>
    </>
  );
}
