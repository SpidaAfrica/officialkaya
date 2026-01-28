import React, { ComponentProps, useCallback } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "@/lib/icons";
import { Label } from "./ui/label";

export default function FormInput({
  leading,
  trailing,
  wrapperClassName,
  label,
  outerClassName,
  error,
  ...props
}: ComponentProps<typeof Input> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  wrapperClassName?(isFocused: boolean): string;
  value?: string;
  label?: string | React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  outerClassName?: string;
  error?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className={outerClassName}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <div
        className={cn(
          "relative flex items-center transition-all duration-300 rounded-md overflow-visible ring-1",
          isFocused ? " ring-primary" : "ring-gray-200",
          wrapperClassName?.(isFocused)
        )}>
        {leading && <div className="pl-2 p-2">{leading}</div>}
        <Input
          {...props}
          ref={inputRef}
          onBlur={() => {
            setIsFocused(false);
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
          placeholder={
            props.type === "password" ? "*********" : props.placeholder
          }
          type={
            props.type === "password"
              ? showPassword
                ? "text"
                : "password"
              : props.type
          }
        />
        {(trailing || props.type === "password") && (
          <div className="inset-y-0 right-0 flex items-center justify-center pr-3">
            {props.type === "password" ? (
              <button
                type="button"
                onClick={() => {
                  console.log("toggleShowPassword");
                  toggleShowPassword();
                }}
                className="focus:outline-none ">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            ) : (
              trailing
            )}
          </div>
        )}
      </div>
    </div>
  );
}
