"use client";
export const dynamic = "force-dynamic";
import { Provider } from "react-redux";
import store from ".";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
