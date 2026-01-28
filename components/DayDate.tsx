import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/custom-select";
import { DatePicker } from "./ui/date-picker";

export default function DayDate() {
  return (
    <div className="flex items-center">
      <Select defaultValue="today">
        <SelectTrigger className="rounded-r-none min-w-16 px-2 focus:outline outline outline-1 outline-foreground/10 py-1 rounded-l-md whitespace-nowrap">
          <SelectValue placeholder="Pick range" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7-days">Last 7 days</SelectItem>
          <SelectItem value="30-days">Last 30 days</SelectItem>
          <SelectItem value="3-months">Last 3 months</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <DatePicker className="rounded-l-none" />
      </div>
    </div>
  );
}
