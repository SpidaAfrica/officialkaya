import React, { PropsWithChildren, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export default function RiderRating({ children }: PropsWithChildren) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  //   const [isOpen, setIsOpen] = useState(true);

  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="z-[100000000] sm:max-w-xl text-center">
        <div className="w-full h-full relative  px-12 py-12 space-y-8">
          <DialogTrigger className="absolute top-0 right-0 p-4">
            <X />
          </DialogTrigger>
          <DialogHeader className="text-center">
            <DialogTitle className="text-center flex justify-center items-center gap-2">
              Rate Your Experience
              <span>⭐</span>
            </DialogTitle>
            <DialogDescription className="text-center">
              Your feedback helps us improve! Let us know how your delivery went
              by rating your rider.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-between space-x-2  outline outline-1 outline-foreground/10 rounded-3xl divide-x">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => handleRatingSelect(star)}
                className={`text-4xl transition-colors duration-200 py-2 px-6 ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}>
                ★
              </button>
            ))}
          </div>

          <DialogTrigger asChild>
            <Button
              disabled={rating === 0}
              className={`max-w-[60%] ${
                rating === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              Rate your Rider
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}
