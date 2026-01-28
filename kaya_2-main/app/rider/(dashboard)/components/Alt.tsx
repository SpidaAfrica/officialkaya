// NOTE: Temporary Workaround
//  COMEBACK: Remove this code and use better alternatives

import { ChevronDown } from "lucide-react";

export const AltInput = ({
  label,
  placeholder,
  icon,
  value,
  onChange
}: {
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <fieldset className="flex mb-5 flex-col">
      <label
        className="text-[14px] mb-1 font-normal leading-5 tracking-[2%] text-[#0A0D14]"
        htmlFor="input">
        {label}
      </label>

      <div className="flex h-10 w-full relative items-center gap-2">
        {icon && (
          <div className="absolute z-10 size-5 left-3 top-1/2 -translate-y-1/2 ">
            {icon}
          </div>
        )}
        <input
          className="border absolute left-0 w-full h-full right-0 top-0 bottom-0 border-[#E2E4E9] rounded-[4px] px-10 "
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </fieldset>
  );
};
export const AltSelect = ({
  label,
  options,
  icon,
}: {
  label: string;
  options: string[];
  icon?: React.ReactNode;
}) => {
  return (
    <fieldset className="flex mb-5 flex-col">
      <label
        className="text-[14px] mb-1 font-normal leading-5 tracking-[2%] text-[#0A0D14]"
        htmlFor="input">
        {label}
      </label>

      <div className="flex h-10 w-full relative items-center gap-2">
        {icon && (
          <div className="absolute z-10 size-5 left-3 top-1/2 -translate-y-1/2 ">
            {icon}
          </div>
        )}
        <select className="border appearance-none absolute left-0 w-full h-full right-0 top-0 bottom-0 border-[#E2E4E9] rounded-[4px] px-10 ">
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown className="size-5 absolute right-2.5 top-1/2 -translate-y-1/2" />
      </div>
    </fieldset>
  );
};
