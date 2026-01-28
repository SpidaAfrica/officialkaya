"use client";
export const dynamic = "force-dynamic";

import Image from "next/image";
import { useEffect, useState } from "react";
import map from "@/assets/big-map.svg";
import { OrderDetailsModal } from "@/app/rider/(dashboard)/components/orders-page";

export const OrderMap = () => {
  const singleOrder = {
    id: 1,
    pickup_location: "Location street",
    dropoff_location: "Location street",
    order_id: "ID23456",
    order_created: "20mins ago",
    order_fare: "NGN30,000",
    pickup_time: "17mins",
    dropoff_time: "17mins",
    status: "Awaiting Action",
  };

  const [showOrderDetails, setShowOrderDetails] = useState(false);
  useEffect(() => {
    if (showOrderDetails) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";
    } else {
      document.body.style.overflow = "auto";
      // document.body.style.paddingRight = "17px";
    }
  }, [showOrderDetails]);

  return (
    <div className="w-[90%] mx-auto min-h-[800px] flex-1  my-[83px] relative px-[84px] ">
      <Image
        onClick={() => setShowOrderDetails(true)}
        src={map}
        alt="map"
        fill
        className="w-full cursor-pointer h-[800px]_ h-full object-cover"
      />
      {showOrderDetails && (
        <OrderDetailsModal
          customerNotified={false}
          setCustomerNotified={() => {}}
          activeOrder={singleOrder}
          setActiveOrder={() => {}}
          isOpen={showOrderDetails}
          setDetailsModalOpen={setShowOrderDetails}
        />
      )}
    </div>
  );
};
