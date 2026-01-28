"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AuthForm from "../riderAuth";
import { DropDown, Nigeria } from "@/components/svgs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function SignInPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // allow only digits
    setPhoneNumber(rawValue.replace(/^0/, "")); // remove leading zero
  };

  React.useEffect(() => {
    if (phoneNumber) {
      sessionStorage.setItem("phoneNumber", `+234${phoneNumber}`);
    }
  }, [phoneNumber]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("https://api.kaya.ng/kaya-api/send-phone-otp.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `+234${phoneNumber}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      console.log("OTP sent successfully:", data);
      router.push("/(auth)/verify");
    } catch (error: any) {
      console.error("OTP send error:", error.message);
      alert(error.message);
    }
  };

  return (
    <AuthForm>
      <div className="mx-auto w-[336px] px-4 md:w-[400px] flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <h3 className="text-[#111827] text-2xl md:text-[32px] font-bold tracking-[-0.06em] leading-tight md:leading-[38.08px] text-center">
            Join the Movement! 🚴‍♂️
          </h3>
          <p className="text-[#333232] text-balance text-center text-sm md:text-[16px] font-normal tracking-[-0.06em] leading-[24px] px-2">
            A verification code will be sent to your number to confirm and
            create your account.
          </p>
        </div>
        <form
          className="flex flex-col mt-8 md:mt-[46px] w-full items-center justify-center gap-2.5"
          onSubmit={handleSubmit}>
          <fieldset className="flex flex-col w-full gap-1.5">
            <label htmlFor="phoneNumber">
              <span className="text-[#0A0D14] text-sm md:text-[16px] font-normal tracking-[-0.06em] leading-[24px]">
                Phone Number
              </span>
            </label>
            <div className="border w-full md:w-[400px] border-[#D1D5DB] px-2 rounded-[8px] flex items-center justify-center gap-2.5">
              <div className="flex items-center justify-center gap-2.5">
                <Nigeria />
                <p className="text-[#0A0D14] text-[16px] font-normal tracking-[-0.06em] leading-[24px]">
                  +234
                </p>
              </div>
              <input
                type="number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleChange}
                className="w-full  h-[48px] border-l border-[#D1D5DB]  outline-none px-2 py-2.5 text-[#0A0D14] text-[16px] font-normal tracking-[-0.06em] leading-[24px] placeholder:text-[#6B7280]"
              />
            </div>
          </fieldset>
          <fieldset className="mt-8 md:mt-[60px] w-full">
            <Button
              type="submit"
              className="bg-[#00ABFD] w-full md:w-[400px] text-white text-sm md:text-[16px] font-normal tracking-[-0.06em] leading-[24px] px-4 py-2.5 rounded-[8px]">
              Create an Account
            </Button>
          </fieldset>
          <p className="text-[#0A0D14] text-sm md:text-[16px] font-semibold tracking-[-0.06em] leading-[24px]">
            Already have an account?{" "}
            <Link href="/rider/signin">
              <span className="text-[#00ABFD]">Log In</span>
            </Link>
          </p>
        </form>
      </div>
    </AuthForm>
  );
}
