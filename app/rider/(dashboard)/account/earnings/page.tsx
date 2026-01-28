"use client";
export const dynamic = "force-dynamic";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function EarningsPage() {
  return (
    <div className="lg:w-[85%] mx-auto flex flex-col bg-primary/5 my-14">
      <div className="w-full"></div>
      <div className="relative py-20 flex justify-center items-center w-full mx-auto">
        <div className="flex relative flex-col lg:flex-row lg:w-[85%] mx-auto items-center justify-center gap-3 h-full w-[90%] ">
          <Link
            href={"/rider/home"}
            className="text-primary ml-auto absolute -top-12 right-4 flex items-center gap-1">
            <ChevronLeft className="w-5" />
            <span>Go Back</span>
          </Link>
          <div className="h-60 lg:h-72 w-full lg:w-96 rounded-sm bg-primary p-5 flex flex-col justify-between text-background">
            <small className="outline w-fit outline-1 outline-background/80 px-2 py-1 rounded-full ">
              total earnings
            </small>
            <p className=" text-4xl font-semibold">
              NGN {(50000).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
