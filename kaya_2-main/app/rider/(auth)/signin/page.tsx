"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AuthForm from "../riderAuth";
import { Nigeria, Lock, Eye } from "@/components/svgs";
import { Apple, DropDown, Google, X } from "@/components/svgs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const router = useRouter();
  const handlePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (name === "phoneNumber") {
      setPhoneNumber(value.replace(/^0/, ""));
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://api.kaya.ng/kaya-api/login.php", {
        method: "POST", // 👈 very important
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber: `+234${phoneNumber}`,
          password
        })
      });


      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }

      // ✅ Store in sessionStorage only on client
      if (typeof window !== "undefined") {
        sessionStorage.setItem("user", JSON.stringify(data));
        //localStorage.setItem("jwt_token", data.token); // Store JWT token
        const user = data.user || {};

        sessionStorage.setItem("userId", user.id || "");
        sessionStorage.setItem("email", user.email || "");
        sessionStorage.setItem("imageUrl", user.image_url || "");
        sessionStorage.setItem("fullName", user.fullName || "");
        sessionStorage.setItem("phoneNumber", user.phone || "");
        sessionStorage.setItem("role","rider");
      }

      // ✅ Redirect to home
      router.push("/rider/home");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthForm>
      <div className="flex flex-col items-ce  nter justify-center w-full max-w-md mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <span className="text-2xl md:text-3xl text-[#0A0D14] font-semibold">
            Welcome Back! 🤩
          </span>
          <p className="text-sm md:text-base text-muted-foreground">
            Let&apos;s get you back to your parcels
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <fieldset className="flex flex-col w-full gap-3">
            <label htmlFor="phoneNumber">
              <span className="text-sm md:text-base text-[#0A0D14] font-medium">
                Phone Number
              </span>
            </label>
            <div className="border w-full border-[#D1D5DB] px-3 rounded-lg flex items-center gap-2">
              <div className="flex items-center gap-2 py-3">
                <Nigeria />
                <p className="text-[#0A0D14] text-sm md:text-base">+234</p>
                <DropDown className="text-[#525866]" />
              </div>
              <input
                type="number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleChange}
                className="w-full h-12 border-l border-[#D1D5DB] outline-none px-3 text-sm md:text-base placeholder:text-[#6B7280]"
              />
            </div>
          </fieldset>

          <fieldset className="flex flex-col w-full gap-3">
            <label htmlFor="password">
              <span className="text-sm md:text-base text-[#0A0D14] font-medium">
                Password
              </span>
            </label>
            <div className="border w-full border-[#D1D5DB] px-3 rounded-lg flex items-center gap-2">
              <Lock />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={handleChange}
                className="w-full h-12 outline-none px-3 text-sm md:text-base placeholder:text-[#6B7280]"
              />
              <button type="button" onClick={handlePassword}>
                <Eye
                  fill={showPassword ? "#eee" : "#868C98"}
                  className="cursor-pointer"
                />
              </button>
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full h-12 bg-[#00ABFD] rounded-lg text-white text-sm md:text-base font-semibold mt-6">
            Log In
          </button>

          <div className="flex items-center justify-center gap-2 mt-6">
            <p className="text-[#333232] text-sm md:text-base">
              Forgot Password?
            </p>
            <Link href="/rider/reset">
              <p className="text-[#00ABFD] text-sm md:text-base">Reset It</p>
            </Link>
          </div>
        </form>

        <div className="flex flex-col gap-6 w-full mt-8">
          {/*
          <div className="relative border-t border-[#E2E4E9]">
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[#868C98] text-sm">
              OR
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {[Google, Apple, X].map((Icon, index) => (
              <button
                key={index}
                className="p-3 md:px-[30px] md:py-[10px] border border-[#E2E4E9] rounded-lg hover:bg-gray-50">
                <Icon />
              </button>
            ))}
          </div>
          */}
          <p className="text-center text-[#333232] font-semibold text-sm md:text-base">
            Don&apos;t have an account?{" "}
            <Link href="/rider/signup">
              <span className="text-[#00ABFD]">Register</span>
            </Link>
          </p>
        </div>
      </div>
    </AuthForm>
  );
}
