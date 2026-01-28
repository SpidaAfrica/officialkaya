import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "./layouts/theme";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Kaya",
  description:
    "Reliable service at a negotiable price that fits your budget. Deliver more for less! 💸",
  icons: {
    icon: "/logo_icon.png", // or .png if you prefer
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-background text-foreground`}>
        <Suspense
          fallback={
            <div className="w-full h-full  flex items-center justify-center text-primary">
              <span className="inline-block h-8_">
                <svg
                  className="animate-spin"
                  width="26"
                  height="26"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    opacity="0.2"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20 10C20 15.5228 15.5229 20 10 20C4.47705 20 0 15.5228 0 10C0 4.47717 4.47705 0 10 0C15.5229 0 20 4.47717 20 10ZM18 10C18 14.4182 14.4185 18 10 18C5.58154 18 2 14.4182 2 10C2 5.58173 5.58154 2 10 2C14.4185 2 18 5.58173 18 10Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 0C4.47705 0 0 4.47717 0 10H2C2 5.58173 5.58154 2 10 2V0Z"
                    fill="white"
                  />
                </svg>
              </span>
            </div>
          }>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange>
            {/* <AppLayout> */}
            {/* {children} */}
            <main className="relative">{children as any}</main> <Toaster />
            {/* </AppLayout> */}
            
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
