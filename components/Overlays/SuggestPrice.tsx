"use client";

import { useEffect, useState } from "react";
import { Actions, DetailsLayout, IncrementDecrement } from "@/app/shared";
import { MoneyIcon } from "@/assets";
import { InfoIcon, WarnIcon } from "@/lib/icons";
import { Dot, X } from "lucide-react";
import Image from "next/image";
import { PropsWithChildren } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import DynamicOverlay from "./DynamicOverlay";
import DynamicTrigger from "./DynamicTrigger";

interface SuggestPriceProps {
  actions?: Actions;
  onOpenChange?(open: boolean): void;
  open?: boolean;
  onDataChanged?: () => void;
}

export function SuggestPrice({
  actions,
  children,
  onOpenChange,
  open,
  onDataChanged,
}: PropsWithChildren<SuggestPriceProps>) {
  const [paymentMethod, setPaymentMethod] = useState("online-payment");

  // Only access sessionStorage in useEffect (runs on client only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMethod = sessionStorage.getItem("paymentMethod");
      if (storedMethod) {
        setPaymentMethod(storedMethod);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("paymentMethod", paymentMethod);
    }
  }, [paymentMethod]);

  const handleSavePrice = () => {
    actions?.switchPage?.("DELIVERY_DETAILS");
    onDataChanged?.();
  };

  const handleTriggerOpen = () => {
    onOpenChange?.(true); // Trigger modal open when button is clicked
  };

  return (
    <DynamicOverlay onOpenChange={onOpenChange} open={open} trigger={<div onClick={handleTriggerOpen}>{children}</div>}>
      <DetailsLayout title="Suggest a Price" hide={() => actions?.close?.()}>
        <div className="flex items-center px-3 py-4 gap-6 rounded-md bg-orange-tint/[7%] justify-between">
          <div className="rounded-full h-fit p-3 bg-orange-tint/5">
            <Image src={MoneyIcon} alt="fare" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-4">
              <p className="font-semibold text-xl">NGN{"25,000"}</p>
              <span className="font-semibold flex bg-background items-center rounded-full text-xs text-gray-400 border-gray-400 border pr-2">
                <Dot />
                Standard
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <span>Enter a new offer</span>
          <div className="rounded-lg p-2 bg-primary/5">
            <IncrementDecrement />
          </div>
          <div className="flex items-center gap-2 text-foreground/60 text-sm">
            <WarnIcon className="w-4" />
            <span>Capped at</span>
            <span className="font-semibold">+N100</span>
            <span>for your convenience</span>
          </div>
        </div>

        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="flex items-center gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online-payment" id="online-payment" />
            <Label htmlFor="online-payment">Online Payment</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash">Cash</Label>
          </div>
        </RadioGroup>

        <div className="pt-6">
          <DynamicTrigger>
            <Button onClick={handleSavePrice}>Save Price</Button>
          </DynamicTrigger>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-xl bg-primary/20">
            <div className="w-[90%] mx-auto flex gap-3 py-4">
              <div className="text-primary">
                <InfoIcon />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    Why is there a standard price?
                  </p>
                  <button>
                    <X />
                  </button>
                </div>
                <div className="space-y-3 w-[98%] ml-auto text-sm">
                  <div className="flex">
                    <Dot />
                    <p>
                      The rider will be notified of your offer and may accept or
                      decline it.
                    </p>
                  </div>

                  <div className="flex">
                    <Dot />
                    <p>
                      The rider will be notified of your offer and may accept or
                      decline it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DetailsLayout>
    </DynamicOverlay>
  );
}
