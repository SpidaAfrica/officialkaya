import React, { PropsWithChildren } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export default function DynamicOverlay({
  children,
  trigger,
  onOpenChange,
}: //   open,
PropsWithChildren<{
  trigger: React.ReactNode;
  onOpenChange?(open: boolean): void;
  open?: boolean;
}>) {
  return (
    <>
      <div className="hidden md:block  w-full">
        <Sheet>
          <SheetTrigger asChild>{trigger}</SheetTrigger>
          <SheetContent className="hidden md:flex sm:max-w-[30rem]">
            {children}
          </SheetContent>
        </Sheet>
      </div>

      <div className="block md:hidden">
        <Dialog onOpenChange={(state) => onOpenChange?.(state)}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          <DialogContent className="w-[90%] h-[90%]">{children}</DialogContent>
        </Dialog>
      </div>
    </>
  );
}
