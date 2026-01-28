"use client";
export const dynamic = "force-dynamic";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker(props: React.ComponentProps<typeof Button>) {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant={"outline"}
          {...props}
          className={cn(
            "justify-start text-left font-normal py-[4px] h-auto outline-1 outline-foreground/10",
            !date && "text-muted-foreground",
            props.className
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0 px-3 pb-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        <div className="flex gap-3 pt-2 border-t px-1">
          <Button variant={"outline"}>Discard</Button>
          <Button>Apply Changes</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
