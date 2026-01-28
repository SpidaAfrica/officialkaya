"use client";
export const dynamic = "force-dynamic";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect } from "react";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const [checked, setChecked] = React.useState(false);

  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked);
    },
    []
  );

  useEffect(() => {
    const theme = checked ? "dark" : "light";
    const timeout = setTimeout(() => {
      setTheme(theme);
      localStorage.setItem("theme", theme);
    }, 500);
    return () => clearTimeout(timeout);
  }, [checked, setTheme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setChecked(savedTheme === "light" ? false : true);
      setTheme(savedTheme);
    }
  }, [setTheme]);

  return (
    <div
      className={cn(
        "flex items-center justify-center p-2 rounded-full",
        theme === "light" && "bg-foreground",
        checked && "!bg-transparent"
      )}>
      <input
        id="toggle"
        className="toggle"
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
      />
    </div>
  );
}
