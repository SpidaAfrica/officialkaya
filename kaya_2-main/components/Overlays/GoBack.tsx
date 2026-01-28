import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function GoBack() {
  return (
    <Link
      href={"/rider/home"}
      className="text-primary ml-auto absolute -top-12 right-4 flex items-center gap-1">
      <ChevronLeft className="w-5" />
      <span>Go Back</span>
    </Link>
  );
}
