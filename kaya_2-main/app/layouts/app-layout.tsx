"use client";
export const dynamic = "force-dynamic";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Redirect from "@/lib/utils/redirect";
import { PortalElements } from "../../components/Overlays";
import { Provider } from "react-redux";
import store from "@/state/store";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { DayPickerProvider } from "react-day-picker";
import { Footer } from "@/components/Footer";
export function AppLayout({
  children,
  userType = "passenger",
}: React.PropsWithChildren<{ userType?: "passenger" | "rider" }>) {
  // Initialize a new queryclient instance
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <div id="modal" />
        <div id="notification" />
        <Redirect />
        <div className="fixed bottom-0 left-0">
          <PortalElements />
        </div>
        <SidebarProvider>
          <DayPickerProvider initialProps={{}}>
            <main className="flex w-screen h-svh">
              {/* Sidebar */}
              <AppSidebar
                userType={userType}
                className="col-start-1 col-end-2"
              />
              {/* <SidebarInset className="bg-pink-400" /> NOTE: what is actually the use of this? */}
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col w-full">
                <Header userType={userType} />
                <div
                  className={`relative flex-1 flex flex-col w-full overflow-y-auto`}>
                  {children}
                  <Footer />
                </div>
              </div>
            </main>
          </DayPickerProvider>
        </SidebarProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export function MainContent({
  children,
  padSides = true,
  className,
}: React.PropsWithChildren<{ padSides?: boolean; className?: string }>) {
  return (
    <main
      className={cn(
        className,
        padSides && "p-2",
        "w-full relative flex-1 h-full_"
      )}>
      {children}
    </main>
  );
}
