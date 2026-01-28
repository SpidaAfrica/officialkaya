import React from "react";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import { OnboardingImageTwo } from "@/assets";

export default function OnboardingPage() {
  return (
    <div className="h-svh flex flex-col bg-white">
      <div className="flex items-end flex-1">
        <Image
          src={OnboardingImageTwo}
          alt="onboarding"
          className="mx-auto w-full"
        />
      </div>
      <div className="w-[85%] flex-1 h-full mx-auto py-6    ">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-center text-primary">
            Effortless Delivery in Just a Few Taps
          </h1>
          <p className="text-darker text-center">
            Book, negotiate, pay, and track your parcel from anywhere. Our app
            makes delivery as easy as it should be.
          </p>
        </div>
        <Button className="w-full capitalize font-semibold mt-8">
          get started
        </Button>
      </div>
    </div>
  );
}
