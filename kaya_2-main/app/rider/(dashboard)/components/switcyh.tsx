"use client";
export const dynamic = "force-dynamic";

import clsx from "clsx";
import { useState } from "react";

type SwitchProps = {
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
};

export const Switch = ({ onChange, defaultChecked = false }: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked); // 🔥 call parent when toggled
  };

  return (
    <div
      className={clsx(
        "lg:w-[83px] z-0 lg:h-[47px] w-[65px] h-[37px] items-center flex justify-end rounded-[285px] px-[6px]",
        isChecked ?  "bg-[#00ABFD]" : "bg-[#CDD0D5]"
      )}
      onClick={handleToggle} // 👉 put click on container for better UX
    >
      <div
        className={clsx(
          "lg:size-[36px] size-[28px] rounded-full cursor-pointer bg-white grid place-items-center transform transition-transform",
          isChecked ? "" : "-translate-x-full"
        )}
      >
        <div
          className={clsx(
            "lg:size-[12px] size-[9px] rounded-full",
            isChecked ? "bg-primary"  : "bg-[#CDD0D5]"
          )}
        ></div>
      </div>
    </div>
  );
};
