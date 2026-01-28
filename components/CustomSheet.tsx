import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export default function CustomSheet({
  body,
  title,
  trigger,
}: {
  trigger: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{body}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
