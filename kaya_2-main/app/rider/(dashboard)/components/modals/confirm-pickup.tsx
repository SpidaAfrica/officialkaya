import clsx from "clsx";
import Image from "next/image";
import box from "../../../../../assets/box.png";
import { Button } from "@/components/ui/button";
import SuccessModal from "@/components/Overlays/SuccessModal";
import { Dispatch, SetStateAction, useState } from "react";

type ActiveOrderType = {
  order_id?: string;
};

export const ConfirmPickupModal = ({
  mainText,
  desc,
  activeOrder,
  setActiveOrder,
  modalOpen,
  setModalOpen,
  continueFn,
  cancelFn,
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  activeOrder: ActiveOrderType | null;
  setActiveOrder: Dispatch<SetStateAction<ActiveOrderType | null>>;
  mainText: string;
  desc: string;
  continueFn: () => void;
  cancelFn: () => void;
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirmPickup = async () => {
    try {
      const response = await fetch('https://api.kaya.ng/kaya-api/rider/confirm-pickup.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ package_id: activeOrder?.order_id }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        continueFn(); // optional follow-up action
      } else {
        alert("Failed to confirm pickup: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={clsx(
        "fixed inset-0 z-[100000] bg-[#020D1730] flex items-center justify-center",
        modalOpen ? "block" : "hidden"
      )}
    >
      <div className="w-[347px] lg:w-[652px] rounded-[16px] bg-white py-5 flex flex-col items-center justify-center">
        <Image src={box} alt="confirm-pickup" width={171} height={169} />
        <p className="text-[26px] my-2.5 leading-[36px] text-[#475467] font-semibold text-center">
          {mainText}
        </p>
        <p className="text-[18px] max-w-[90%] text-center mb-6 leading-[24px] text-[#8A8A8C] font-normal">
          {desc}
        </p>
        <div className="flex flex-col lg:flex-row w-full px-4 items-center justify-center gap-4">
          <Button
            onClick={() => {
              cancelFn();
              setModalOpen(false);
            }}
            className="text-[16px] bg-white text-[#525866] w-full border border-[#00ABFD] rounded-[6px]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleConfirmPickup();
              setModalOpen(false);
            }}
            className="w-full bg-[#00ABFD] text-white rounded-[6px]"
          >
            Confirm
          </Button>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal>
          <p className="text-center text-green-600 text-lg font-semibold">
            Pickup confirmed successfully!
          </p>
        </SuccessModal>
      )}
    </div>
  );
};



/*
import clsx from "clsx";
import Image from "next/image";
import box from "../../../../../assets/box.png";
import { Button } from "@/components/ui/button";
import SuccessModal from "@/components/Overlays/SuccessModal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type ActiveOrderType = {
  order_id?: string;
};
/*
export const OrderDetailsModal = ({
  setCustomerNotified,
  customerNotified,
  activeOrder,
  isOpen,
  setDetailsModalOpen,
  setActiveOrder,
}: {
  setCustomerNotified: (value: boolean) => void;
  customerNotified: boolean;
  activeOrder: ActiveOrderType | null;
  isOpen: boolean;
  setDetailsModalOpen: (value: boolean) => void;
  setActiveOrder: Dispatch<SetStateAction<ActiveOrderType | null>>;
}) => {
*/
/*
export const ConfirmPickupModal = ({
  mainText,
  desc,
  activeOrder,
  setActiveOrder,
  modalOpen,
  setModalOpen,
  cancelFn,
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  activeOrder: ActiveOrderType | null;
  setActiveOrder: Dispatch<SetStateAction<ActiveOrderType | null>>;
  mainText: string;
  desc: string;
  continueFn: () => void;
  cancelFn: () => void;
}) => {
  console.log("we dey here");
  const handleConfirmPickup = async (order_id?: string) => {
    try {
      const response = await fetch('https://api.kaya.ng/kaya-api/rider/confirm-pickup.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ package_id: activeOrder?.order_id }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert("Pickup confirmed successfully!");
        // Optionally update your local state here (e.g., refresh orders list)
      } else {
        alert("Failed to confirm pickup: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={clsx(
        "fixed h-screen z-[100000] top-0 left-0 right-0 bottom-0 w-full bg-[#020D1730] flex items-center justify-center",
        modalOpen ? "block" : "hidden"
      )}>
      <div className=" w-[347px] lg:w-[652px]  h-fit lg:h-[389px]  rounded-[16px] bg-[#fff] py-5  flex flex-col items-center justify-center">
        <Image src={box} alt="confirm-pickup" width={171} height={169} />
        <p className="text-[26px] my-2.5  leading-[36px] tracking-[-6%] text-[#475467] font-semibold">
          {mainText}
        </p>
        <p className="text-[18px] lg:max-w-[436px] max-w-[239px] mb-6 text-center leading-[24px] tracking-[-6%] text-[#8A8A8C] font-normal">
          {desc}
        </p>
        <div className="flex flex-col lg:flex-row w-full lg:px-5 px-[14px] items-center justify-center gap-4">
          <Button
            onClick={() => {
              cancelFn();
              setModalOpen(false);
              handleConfirmPickup(activeOrder.order_id);
            }}
            className="text-[16px] bg-white text-[#525866] w-full border-[0.73px] border-[#00ABFD] rounded-[6px] ">
            Cancel
          </Button>
          <SuccessModal>
            <Button
              onClick={() => {
                // continueFn();
                setModalOpen(false);
              }}
              className=" w-full ">
              Confirm
            </Button>
          </SuccessModal>
        </div>
      </div>
    </div>
  );
};
*/
