import React from "react";
import BigMap from "@/assets/big-map.svg";
import Image from "next/image";
import { DeliveryDetails } from "@/components/Overlays/DeliveryDetails";
import { Button } from "@/components/ui/button";

export default function BigMapPage() {
  return (
    <div className="relative w-[90%] mx-auto my-12 flex-1 max-h-[45rem]">
      <DeliveryDetails>
        <Button className="bg-black w-fit absolute top-4 left-4 hover:bg-gray-600">
          View Delivery Details
        </Button>
      </DeliveryDetails>
      <Image
        src={BigMap}
        alt="big-map"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
