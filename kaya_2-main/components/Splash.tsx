import { IconLogo } from "@/assets";
import Image from "next/image";
import React from "react";

export default function Splash() {
  return (
  <div className="w-full h-svh flex items-center justify-center bg-primary mx-auto my-auto">
      <Image
        src={IconLogo}
        alt="icon-logo"
        width={75}
        height={75}
        priority
      />
    </div>
  );
}
/*className="object-contain"*/
