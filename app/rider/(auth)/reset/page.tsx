"use client";
export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";
import AuthForm from "../riderAuth";
import reset from "@/public/rider/rest.svg";
import { useRouter } from "next/navigation";
import { DropDown, Nigeria } from "@/components/svgs";
import FormInput from "@/components/FormInput";
import { LockIcon } from "@/lib/icons";

type ResetStep = "phone" | "otp" | "password" | "success";

export default function Reset() {
  const [currentStep, setCurrentStep] = React.useState<ResetStep>("phone");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [otp, setOtp] = React.useState<string[]>(["", "", "", ""]);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const router = useRouter();

  const handlePhoneSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // here you would typically make an API call to send OTP
    setCurrentStep("otp");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.querySelector(
        `input[name='otp-${index + 1}']`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would validate OTP
    setCurrentStep("password");
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Show error
      return;
    }
    // Here you would reset password
    setCurrentStep("success");
  };

  const renderStep = () => {
    switch (currentStep) {
      case "phone":
        return (
          <form onSubmit={handlePhoneSubmit} className="w-full space-y-6">
            <div className="flex flex-col items-center gap-4 text-center mb-8">
              <Image src={reset} alt="reset" />
              <span className="text-2xl md:text-[32px] font-bold">
                Reset Password
              </span>
              <p className="text-[#333232] text-sm md:text-base">
                Enter your phone number to receive a verification code
              </p>
            </div>

            <fieldset className="flex flex-col w-full gap-3">
              <label htmlFor="phoneNumber">
                <span className="text-[#0A0D14] text-sm md:text-base font-medium">
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full h-12 border-l border-[#D1D5DB] outline-none px-3 text-sm md:text-base placeholder:text-[#6B7280]"
                />
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full bg-[#00ABFD] text-white py-3 rounded-lg text-base font-medium">
              Send Code
            </button>
          </form>
        );

      case "otp":
        return (
          <form onSubmit={handleOtpSubmit} className="w-full space-y-6">
            <div className="flex flex-col items-center gap-4 text-center mb-8">
              <Image src={reset} alt="reset" />
              <span className="text-2xl md:text-[32px] font-bold">
                Verify number
              </span>
              <p className="text-[#333232] text-sm md:text-base">
                To Verify your account, please enter the OTP we sent to +234
                8044679800
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="number"
                  name={`otp-${index}`}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-full text-[#0A0D14] aspect-square text-center text-xl sm:text-2xl font-semibold border border-[#D1D5DB] rounded-lg focus:border-[#00ABFD] focus:ring-1 focus:ring-[#00ABFD] outline-none"
                  maxLength={1}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={otp.some((digit) => digit === "")}
              className="w-full bg-[#00ABFD] text-white py-3 rounded-lg text-base font-medium disabled:opacity-60">
              Verify Code
            </button>

            <div className="text-center space-y-1">
              <p className="text-[#111827] text-sm">
                Didn&apos;t receive the code?
              </p>
              <button
                type="button"
                className="text-[#0A0D14] text-base underline font-medium">
                Resend Code
              </button>
            </div>
          </form>
        );

      case "password":
        return (
          <form onSubmit={handlePasswordSubmit} className="w-full space-y-6">
            <div className="flex flex-col items-center gap-4 text-center mb-8">
              <Image src={reset} alt="reset" />
              <span className="text-2xl md:text-[32px] font-bold">
                New Password
              </span>
              <p className="text-[#333232] text-sm md:text-base">
                Secure your account with a strong password
              </p>
            </div>

            <FormInput
              label="New Password"
              leading={<LockIcon />}
              id="newPassword"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormInput
              label="Confirm Password"
              leading={<LockIcon />}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
            />

            <button
              type="submit"
              disabled={!password || !confirmPassword}
              className="w-full bg-[#00ABFD] text-white py-3 rounded-lg text-base font-medium disabled:opacity-60">
              Reset Password
            </button>
          </form>
        );

      case "success":
        return (
          <div className="w-full gap-6 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center mb-8">
              <svg
                width="148"
                height="147"
                viewBox="0 0 148 147"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                  opacity="0.08"
                  cx="74"
                  cy="73.5"
                  r="73.5"
                  fill="#34C759"
                />
                <circle
                  opacity="0.07"
                  cx="73.9989"
                  cy="73.5001"
                  r="65.5301"
                  fill="#34C759"
                />
                <ellipse
                  opacity="0.07"
                  cx="74"
                  cy="73.5"
                  rx="52"
                  ry="52.5"
                  fill="#34C759"
                />
                <path
                  opacity="0.4"
                  d="M48.1758 78.2962C48.1758 78.2962 53.7104 78.2962 61.0899 91.2104C61.0899 91.2104 81.6007 57.3876 99.8324 50.623"
                  stroke="#34C759"
                  stroke-width="6.25414"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M61.0898 91.2104C61.0898 91.2104 81.6006 57.3876 99.8323 50.623"
                  stroke="#34C759"
                  stroke-width="6.25414"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span className="text-2xl  md:max-w-[406px] md:text-[32px] font-bold">
                Your password has been successfully reset!
              </span>
              <p className="text-[#333232] text-sm md:text-base text-center max-w-[391px]">
                You can now log in with your new credentials. Thank you for
                choosing Kaya!
              </p>
            </div>

            <button
              onClick={() => router.push("/rider/signin")}
              className="w-ful text-[#00ABFD] mx-auto text-center text-base font-semibold">
              Back to Home
            </button>
          </div>
        );
    }
  };

  return (
    <AuthForm showCarousel={false}>
      <div className="mx-auto w-[336px] px-4 md:w-[400px] flex flex-col items-center justify-center h-full">
        {renderStep()}
      </div>
    </AuthForm>
  );
}
