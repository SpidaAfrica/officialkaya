import React, { useState } from "react";
import COUNTRIES from "@/data/county-phone.json";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CountryPicker: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  return (
    // // <div className="flex items-center gap-2">
    //   {/* <CustomSelect
    //     isLoading={false}
    //     itemBuilder={(item) => (
    //       <div className="flex items-center gap-2">
    //         <span>{item.flag}</span>
    //         <span>{item.name}</span>
    //       </div>
    //     )}
    //     placeholder={"Country Dial Codes"}
    //     items={COUNTRIES.map((country, i) => ({
    //       id: i.toString(),
    //       name: country.dial_code,
    //       flag: country.flag,
    //     }))}
    //     value={selectedCountry.id!.toString()}
    //     onSelect={(value) =>
    //       setSelectedCountry(
    //         COUNTRIES.find((country) => country.id?.toString() === value) ||
    //           COUNTRIES[0]
    //       )
    //     }
    //   /> */}
    // <Command className="relative overflow-visible">
    //   <CommandInput placeholder="Type a command or search..." />
    //   <CommandList className="absolute -bottom-2 z-50 bg-background">
    //     <CommandEmpty>No results found.</CommandEmpty>
    //     {/* <CommandGroup heading="Suggestions">
    //       <CommandItem>Calendar</CommandItem>
    //       <CommandItem>Search Emoji</CommandItem>
    //       <CommandItem>Calculator</CommandItem>
    //     </CommandGroup>
    //     <CommandSeparator />
    //     <CommandGroup heading="Settings">
    //       <CommandItem>Profile</CommandItem>
    //       <CommandItem>Billing</CommandItem>
    //       <CommandItem>Settings</CommandItem>
    //     </CommandGroup> */}
    //     {COUNTRIES.map((country, i) => (
    //       <CommandItem key={i}>
    //         <div className="flex items-center gap-2">
    //           <span>{country.flag}</span>
    //           <span>{country.dial_code}</span>
    //           <span className="hidden">{country.name}</span>
    //         </div>
    //       </CommandItem>
    //     ))}
    //   </CommandList>
    // </Command>

    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="justify-between px-1">
          {selectedCountry
            ? selectedCountry.flag + " " + selectedCountry.dial_code
            : "Select country..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map((country) => (
                <CommandItem
                  key={country.id}
                  value={country.id?.toString()}
                  onSelect={(currentValue) => {
                    setSelectedCountry(
                      COUNTRIES.find(
                        (country) => country.id?.toString() === currentValue
                      ) || COUNTRIES[0]
                    );
                    setOpen(false);
                  }}>
                  <Check
                    className={cn(
                      "h-4 w-",
                      selectedCountry.id === country.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.dial_code}</span>
                    <span className="hidden">{country.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    // </div>
  );
};

export default CountryPicker;
