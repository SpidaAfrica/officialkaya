import React, { PropsWithChildren } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import RiderRating from "./Rating";

interface SuccessModalProps {
  isOpen?: boolean;
  onClose?: (state: boolean) => void;
  title?: string;
  message?: string;
  buttonText?: string;
  showButton?: boolean;
}

const SuccessModal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText,
  showButton = true,
  children,
}: PropsWithChildren<SuccessModalProps>) => {
  return (
    <Dialog open={isOpen} onOpenChange={(state) => onClose?.(state)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        title=""
        className="z-[10000000] w-[90%] rounded-2xl max-w-lg text-center overflow-clip">
        <div className="relative h-full flex flex-col items-center space-y-4  p-6 py-12">
          <DialogTrigger className="text-foreground ml-auto absolute top-2 right-2">
            <X />
          </DialogTrigger>

          {/* Success Icon */}
          <div className="relative p-3">
            <div className="h-20 w-20 rounded-full bg-emerald-100"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center">
                {/* <Check className="h-8 w-8 text-white" /> */}
                <svg
                  width="155"
                  height="155"
                  viewBox="0 0 155 155"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <circle cx="77.5" cy="77.5" r="65.5" fill="#16B464" />
                  <circle
                    cx="77.5"
                    cy="77.5"
                    r="71.4545"
                    stroke="#34C77D"
                    stroke-opacity="0.2"
                    stroke-width="11.9091"
                  />
                  <path
                    d="M55 81.3333L70.4545 98L106 63"
                    stroke="white"
                    stroke-width="17.8636"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            {title || "Order Completed"}
          </h2>

          <p className="text-gray-500 text-center max-w-xs">
            {message ||
              `Your new location has been successfully added. Ready to use it for
            your next delivery!`}
          </p>

          {/* Action Button */}
          {showButton && (
            <RiderRating>
              <Button className="w-full transition-colors mt-4">
                {buttonText || "Rate your Rider"}
              </Button>
            </RiderRating>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
