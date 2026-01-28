"use client";

import { Actions, DetailsLayout } from "@/app/shared";
import { PropsWithChildren, useEffect, useState } from "react";
import { Label } from "../ui/label";
import FormInput from "../FormInput";
import { cn } from "@/lib/utils";
import { CustomSelect } from "../ui/custom-select";
import { CustomTextArea } from "../CustomTextarea";
import { InfoIcon, WarnIcon2 } from "@/lib/icons";
import { Button } from "../ui/button";
import { Dot, X } from "lucide-react";
import DynamicOverlay from "./DynamicOverlay";
import DynamicTrigger from "./DynamicTrigger";

export function OrderDetails({
  actions,
  children,
  onOpenChange,
  open,
  onDataChanged,
}: PropsWithChildren<{
  onOpenChange?(open: boolean): void;
  open?: boolean;
  actions?: Actions;
  onDataChanged?: () => void;
}>) {
  const [isClient, setIsClient] = useState(false);

  const [senderPhone, setSenderPhone] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [packageCategory, setPackageCategory] = useState("");
  const [packageDescription, setPackageDescription] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const formattedValue = value.replace(/^0/, ""); // Remove leading zero
    if (name === "senderPhone") setSenderPhone(formattedValue);
    if (name === "recipientPhone") setRecipientPhone(formattedValue);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && senderPhone && recipientPhone && packageCategory) {
      sessionStorage.setItem("senderPhone", `+234${senderPhone}`);
      sessionStorage.setItem("recipientPhone", `+234${recipientPhone}`);
      sessionStorage.setItem("packageCategory", packageCategory);
      sessionStorage.setItem("packageDescription", packageDescription);
    }
  }, [isClient, senderPhone, recipientPhone, packageCategory, packageDescription]);

  return (
    <DynamicOverlay onOpenChange={onOpenChange} open={open} trigger={children}>
      <DetailsLayout title="Order Details" hide={() => actions?.close?.()}>
        <div className="py-4 space-y-8">
          <PhoneInput
            label="Sender's Phone Number"
            name="senderPhone"
            value={senderPhone}
            onChange={handleChange}
          />
          <PhoneInput
            label="Recipient's Phone Number"
            name="recipientPhone"
            value={recipientPhone}
            onChange={handleChange}
          />
          <div className="grid gap-2">
            <Label htmlFor="packageCategory">Package Category</Label>
            <CustomSelect
              className="outline !outline-1 !outline-foreground/20 shadow-sm rounded-md py-3 px-2"
              isLoading={false}
              value={packageCategory}
              onSelect={(val) => setPackageCategory(val as string)}
              placeholder="Select Category"
              id="packageCategory"
              name="packageCategory"
              items={[
                { name: "Electronics", id: "1" },
                { name: "Clothings", id: "2" },
                { name: "Shoes", id: "3" },
                { name: "Documents", id: "4" },
                { name: "Products", id: "5" },
                { name: "Computer Accessories", id: "6" },
                { name: "Phones", id: "7" },
                { name: "Food", id: "8" },
                { name: "Others", id: "9" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-light">Package description (Optional)</Label>
            <CustomTextArea
              placeholder="Enter details of items to be delivered"
              className="!w-full"
              onChange={(e) => setPackageDescription(e.target.value)}
              value={packageDescription}
            />
            <div className="flex items-center gap-2 text-gray-400 font-normal text-sm">
              <InfoIcon className="fill-gray-400 stroke-background" />
              <span>
                please make sure your package complies with our guidelines
              </span>
            </div>
          </div>

          <div className="pt-6 md:pt-3">
            <DynamicTrigger>
              <Button
                  onClick={() => {
                    onDataChanged?.(); // Refresh delivery data in parent
                    actions?.switchPage?.("DELIVERY_DETAILS");
                  }}
                >
                Save Details
              </Button>
            </DynamicTrigger>
          </div>
        </div>

        <PackageGuidelines />
      </DetailsLayout>
    </DynamicOverlay>
  );
}

const PhoneInput = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="grid gap-2">
    <Label className="font-light" htmlFor={name}>
      {label}
    </Label>
    <FormInput
      wrapperClassName={(isFocused) => cn(!isFocused && "ring-1 ring-foreground/20")}
      leading={<div className="w-16 overflow-visible border-r pr-2">+234</div>}
      id={name}
      type="phone"
      name={name}
      placeholder="080 **** ****"
      onChange={onChange}
      value={value}
    />
  </div>
);

const PackageGuidelines = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="rounded-xl bg-orange-tint/10">
      <div className="w-[90%] mx-auto flex gap-3 py-4">
        <div className="text-orange-tint">
          <WarnIcon2 />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Package Guidelines</p>
            <button><X /></button>
          </div>
          <div className="space-y-3 w-[98%] ml-auto text-sm">
            {[
              "Clearly label fragile items and provide extra cushioning for protection.",
              "Properly wrap and seal your package to prevent damage during transit.",
              "Ensure your parcel fits within the app's specified size and weight restrictions.",
            ].map((text, i) => (
              <div key={i} className="flex">
                <Dot />
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
