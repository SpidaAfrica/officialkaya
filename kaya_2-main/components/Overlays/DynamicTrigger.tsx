import React, { PropsWithChildren } from "react";
import { SheetTrigger } from "../ui/sheet";
import { DialogTrigger } from "../ui/dialog";

export default function DynamicTrigger({ children }: PropsWithChildren) {
  return (
    <>
      <div className="hidden md:block">
        <SheetTrigger asChild>{children}</SheetTrigger>
      </div>
      <div className="block md:hidden">
        <DialogTrigger asChild>{children}</DialogTrigger>
      </div>
    </>
  );
}
