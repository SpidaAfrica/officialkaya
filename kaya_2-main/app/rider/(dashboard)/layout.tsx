import React from "react";
import { AppLayout } from "@/app/layouts/app-layout";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-svh flex flex-col">
      <main className="flex-[12] overflow-auto">
        <AppLayout userType="rider">{children}</AppLayout>
      </main>
    </div>
  );
};

export default layout;
