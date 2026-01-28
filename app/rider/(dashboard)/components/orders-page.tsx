"use client";
export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronRight,
  Clock,
  Clock12,
  Info,
  MapPinPlusInside,
  MessageSquareMore,
  Phone,
  Plus,
  RefreshCcw,
  X,
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import box from "../../../../assets/box.png";
import map from "../../../../assets/map.png";
import bike from "../../../../assets/bike.svg";
import user from "../../../../assets/temi.png";
import { Button } from "@/components/ui/button";
import boxopen from "../../../../assets/box-open.png";
import { useParams, useRouter } from "next/navigation";
import { ConfirmPickupModal } from "./modals/confirm-pickup";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MapWithRoute from "@/components/Overlays/MapWithRoute";

type Order = {
  id?: number;
  from_location?: string;
  to_location?: string;
  order_id?: string;
  order_created?: string;
  order_fare?: string;
  pickup_time?: string;
  dropoff_time?: string;
  status?: string;
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("available");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<ActiveOrderType | null>(null);
  const [customerNotified, setCustomerNotified] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.tab) {
      setActiveTab(params.tab as string);
    }
  }, [params.tab]);

  useEffect(() => {
    getOrdersNearby();
  }, []);

  const getOrdersNearby = async () => {
    if (typeof window === "undefined") return; // Prevent code from running on server
  
    const storedCoordinates = sessionStorage.getItem("riderCoordinates");
  
    if (!storedCoordinates) {
      console.error("No coordinates found in sessionStorage.");
      return;
    }
  
    const { lat, lng } = JSON.parse(storedCoordinates);
  
    if (!lat || !lng) {
      console.error("Invalid coordinates in sessionStorage.");
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetch(`https://api.kaya.ng/kaya-api/rider/get-nearby-orders.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat,
          lng,
          distance: 5000, // km
        }),
      });
  
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleTabChange = (tab: string) => {
    router.push(`/rider/home?tab=${tab}`);
    setActiveTab(tab);
  };

const statusMap = {
  available: ["pending"],
  ongoing: ["ongoing", "picked"],
};

type TabType = keyof typeof statusMap;

  return (
    <div className="pb-[153px] mt-[115px]">
      {/* Tabs */}
      <div className="flex w-full border-b border-[#E2E4E9] space-x-6 px-[14px] justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange("available")}
            className={`px-4 py-2 font-medium text-[16px] ${
              activeTab === "available"
                ? "border-b-2 border-[#00ABFD] text-[#1E2023]"
                : "text-[#475467]"
            }`}
          >
            Available Orders
          </button>
          <button
            onClick={() => handleTabChange("ongoing")}
            className={`px-4 py-2 font-medium text-[16px] ${
              activeTab === "ongoing"
                ? "border-b-2 border-[#00ABFD] text-[#1E2023]"
                : "text-[#475467]"
            }`}
          >
            Ongoing Orders
          </button>
        </div>

        <button className="flex items-center gap-2 text-primary" onClick={getOrdersNearby}>
          <RefreshCcw /> {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {orders.length === 0 ? (
        <EmptyOrderState />
      ) : (
          <div className="flex mt-[51px] flex-col gap-4">
            {orders
              .filter((order) => {
                if (!activeTab || !(activeTab in statusMap)) return false;
        
                return statusMap[activeTab as TabType].includes(order?.status || "");
              })
              .map((order) => (
                <SingleOrderCard
                  key={order.id}
                  order={order}
                  case2={activeTab}
                  setActiveOrder={setActiveOrder}
                  setDetailsModalOpen={setDetailsModalOpen}
                  refreshOrders={getOrdersNearby}
                />
              ))}
          </div>
      )}

      <OrderDetailsModal
        isOpen={detailsModalOpen}
        setDetailsModalOpen={setDetailsModalOpen}
        activeOrder={activeOrder}
        setActiveOrder={setActiveOrder}
        customerNotified={customerNotified}
        setCustomerNotified={setCustomerNotified}
      />
    </div>
  );
};

interface SingleOrderCardProps {
  case2: string;
  setDetailsModalOpen: (value: boolean) => void;
  order: Order;
  setActiveOrder: Dispatch<SetStateAction<Order | null>>;
  refreshOrders: () => void; // ADD THIS
}

export const SingleOrderCard = ({
  case2,
  setDetailsModalOpen,
  order,
  setActiveOrder,
  refreshOrders,
}: SingleOrderCardProps) => {

  if (typeof window === "undefined") return; // Prevent code from running on server
  
  const riderId = sessionStorage.getItem("rider_id");

  if (!riderId) {
    console.error("No coordinates found in sessionStorage.");
    return;
  }

  
  const handleAction = async (status: "ongoing" | "cancelled") => {
    try {
      const res = await fetch(`https://api.kaya.ng/kaya-api/rider/update-order-status.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.order_id,
          rider_id: riderId,
          status,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Order ${status.toLowerCase()} successfully!`);
        refreshOrders(); // reload orders after action
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order.");
    }
  };
  return (
    <div className="flex lg:flex-row w-full flex-col items-start py-[15px] border-b border-[#F1F1F1] justify-between">
      {/* first section */}
      <div className="w-full justify-between lg:pr-[75px] pr-0 flex items-center">
        <div className="flex gap-[30px]">
          <div className="size-[64px] flex items-center justify-center rounded-[2px] bg-[#F3F9FF]">
            <Image src={boxopen} alt="box" width={43} height={43} />
          </div>
          <div className="flex flex-col gap-5 justify-between w-full">
            <div className="flex flex-col gap-1">
              <p className="text-[16px] leading-5 text-[#475467] font-medium">
                Pickup Location
              </p>
              <p className="text-[20px] leading-[22px] text-[#1E2023] font-medium">
                {order.from_location || "Not available"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[16px] leading-5 text-[#475467] font-medium">
                Drop Off Location
              </p>
              <p className="text-[20px] leading-[22px] text-[#1E2023] font-medium">
                {order.to_location || "Not available"}
              </p>
            </div>

            <p className="text-[14px] flex gap-2.5 items-center text-[#8A8A8C] font-normal">
              <span>
                Order Created {order.order_created || "N/A"}
              </span>
              <span>ID {order.order_id ?? "N/A"}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-[22px] leading-[2]">
            {order.order_fare ? `₦${order.order_fare}` : "₦0"}
          </p>

          <div className="flex mt-[15px] mb-[18px] items-center gap-2.5">
            <div className="rounded-[6px] w-[75px] h-[24px] flex justify-center items-center bg-[#EFFAF6] gap-1">
              <Clock color="#38C793" size={12} />
              <span className="text-[14px] leading-[16px] text-[#38C793] font-medium">
                {order.pickup_time || "--:--"}
              </span>
            </div>
            <div className="rounded-[6px] w-[75px] h-[24px] flex justify-center items-center bg-[#EFECFF] gap-1">
              <Clock color="#2B1664" size={12} />
              <span className="text-[14px] leading-[16px] text-[#2B1664] font-medium">
                {order.dropoff_time || "--:--"}
              </span>
            </div>
          </div>

          <p className="flex gap-[14px] items-center">
            <Info size={20} fill="#475467" color="white" />
            <span className="text-[16px] leading-[18px] text-[#475467]">
              Document
            </span>
          </p>
          {/*
          <button className="flex mt-5 items-center gap-3">
            <Plus size={20} color="#00ABFD" />
            <span className="text-[16px] leading-[18px] text-[#00ABFD]">
              Send new Offer
            </span>
          </button>
          */}
        </div>
      </div>

      {/* second section */}
            <div className="flex w-full lg:w-[231px] flex-row-reverse mt-6 lg:mt-auto lg:flex-col gap-5">
        {case2 === "available" ? (
          <>
            <Button
              className="bg-[#00ABFD] h-[51px] text-white"
              onClick={() => handleAction("ongoing")}
            >
              Accept
            </Button>
            <Button
              className="bg-[#fff] text-[#00ABFD]"
              onClick={() => handleAction("cancelled")}
            >
              Reject
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-4 items-start">
            <div
              onClick={() => {
                setActiveOrder(order);
                setDetailsModalOpen(true);
              }}
              className="w-fit cursor-pointer flex items-center gap-1 text-[#00ABFD]"
            >
              See Details <ChevronRight size={20} color="#00ABFD" />
            </div>
            {order.status === "ongoing" && <AwaitingActionTag />}
          </div>
        )}
      </div>
    </div>
  );
};


export const EmptyOrderState = () => {
  return (
    <div className=" pb-[153px] mt-[115px]">
      <div className=" flex mx-auto lg:flex-row flex-col w-fit items-center  gap-[98px]">
        <Image src={box} alt="verification" width={294} height={291} />
        <div className="flex flex-col gap-2.5 max-w-[437px]">
          <p className=" text-[26px] text-center lg:text-left  font-semiBold leading-[36px] tracking-[-6%] text-[#475467]">
            No Orders Yet! 📭
          </p>
          <p className=" text-[18px] text-center lg:text-left  font-normal leading-[25px] tracking-[-6%] text-[#8A8A8C] ">
            No orders available at the moment. Stay ready—new deliveries could
            pop up any second!
          </p>
        </div>
      </div>
    </div>
  );
};

type ActiveOrderType = {
  id?: number;
  from_location?: string;
  to_location?: string;
  order_id?: string;
  order_created?: string;
  order_fare?: string;
  pickup_time?: string;
  dropoff_time?: string;
  status?: string;
  distance?:number;
  user_name?:string;
  user_image?:string;
  user_phone?: string;
};

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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";
    } else {
      document.body.style.overflow = "auto";
      // document.body.style.paddingRight = "17px";
    }
  }, [isOpen]);

  const [confirmPickupModalOpen, setConfirmPickupModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | undefined>(activeOrder?.status);
  useEffect(() => {
  setOrderStatus(activeOrder?.status);
}, [activeOrder]);

  const [paymentPopupOpen, setPaymentPopupOpen] = useState(false);

  const handleConfirmPickup = async (order_id?: string) => {
    if (!order_id) return;
    try {
      const response = await fetch('https://api.kaya.ng/kaya-api/rider/confirm-pickup.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ package_id: order_id }),
      });
  
      const data = await response.json();
      if (data.success) {
        setOrderStatus("picked");
        setActiveOrder((prev) => prev ? { ...prev, status: "picked" } : null);
      } else {
        alert("Failed to confirm pickup: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong confirming pickup!");
    }
  };
  
  const handleConfirmDelivery = async (order_id?: string) => {
    if (!order_id) return;
    try {
      const response = await fetch('https://api.kaya.ng/kaya-api/rider/confirm-delivery.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id }),
      });
  
      const data = await response.json();
      if (data.success) {
        setOrderStatus("completed");
        setActiveOrder((prev) => prev ? { ...prev, status: "completed" } : null);
        setPaymentPopupOpen(true); // Show payment modal
      } else {
        alert("Failed to confirm delivery: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong confirming delivery!");
    }
  };



 /* if (typeof window === "undefined") return; // Prevent code from running on server
  
  const riderId = sessionStorage.getItem("rider_id");

  if (!riderId) {
    console.error("No coordinates found in sessionStorage.");
    return;
  }
  */
  


  const router = useRouter();
  console.log(activeOrder);
  /*
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
  */
  /*
    const confirmDelivery = async (order_id?: string) => {
      if (!order_id) return;
    
      try {
        const response = await fetch('https://api.kaya.ng/kaya-api/rider/confirm-delivery.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order_id }),
        });
    
        const data = await response.json();
    
        if (data.success) {
          alert("Delivery confirmed! Payment has been initiated.");
          setOrderStatus("delivered");
          setActiveOrder((prev) => prev ? { ...prev, status: "delivered" } : null);
          setDetailsModalOpen(false);
        } else {
          alert("Failed to confirm delivery: " + data.message);
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong confirming delivery!");
      }
    };
  */
  return (
    <>
    <div
      onClick={() => setDetailsModalOpen(false)}
      className={clsx(
        "fixed h-screen w-screen overflow-hidden top-0 left-0 bottom-0 right-0 transition-all duration-300 ease-in-out z-[100] bg-[#020D1730] flex items-center justify-center",
        isOpen ? "left-0 opacity-100" : "left-full opacity-0"
      )}>
      {/* <div className="absolute lg:w-[30rem] w-[335px] mx-auto bg-red-500 left-1/2 -translate-x-1/2 _lg:left-full lg:translate-x-1/2 lg:right-0 top-0 bottom-0 h-[90vh] my-auto lg:h-screen overflow-y-scroll flex flex-col"> */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[92%] md:w-[30rem] right-0 overflow-y-scroll  no-scrollbar  absolute bg-background h-[90%] md:h-full flex flex-col cursor-default">
        <div className="h-fit pb-[17px]">
          <div className="flex sticky top-0  bg-white border-b border-[#E2E4E9] px-4 py-5 items-center justify-between">
            <p className="text-[18px] leading-[25px] tracking-[-6%] text-[#1E2023] font-medium">
              Order Details
            </p>
            <X
              className="cursor-pointer"
              onClick={() => setDetailsModalOpen(false)}
              size={24}
              color="#525866"
            />
          </div>

          <div className="px-[15px] py-3">
           {/* <Image
              src={map}
              alt="map"
              width={370}
              height={280}
              className=" w-full"
            />
            */}
            <MapWithRoute
              from={activeOrder?.from_location}
              to={activeOrder?.to_location}
            />
          </div>

          <div className="bg-white mt-10 px-[18px] max-w-md mx-auto">
            <h2 className="text-[11px] w-fit mb-5 leading-4 font-medium text-primary px-2 py-1.5 rounded-full border border-primary">
              CUSTOMER DETAILS
            </h2>
            <div className="flex mb-[60px] border-b-[0.84px] border-[#F1F1F1 pb-2 items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={activeOrder?.user_image || user}
                  alt="user"
                  width={47}
                  height={47}
                  className="rounded-full"
                />
                <span className="text-[20px] font-medium text-[#1E2023]">
                {activeOrder?.user_name || "Customer Name"}
                </span>
              </div>
              <div className=" flex items-center gap-5">
              <Phone 
                size={25} 
                color="#1D2939" 
                className="cursor-pointer" 
                onClick={() => setPhoneModalOpen(true)} 
              />
 
              <MessageSquareMore 
                size={25} 
                color="#1D2939" 
                className="cursor-pointer" 
                onClick={() => {
                  if (activeOrder?.order_id) {
                    router.push(`/rider/chat/${activeOrder.order_id}`);
                  }
                }}
              />
              
              </div>
            </div>
            <div className="w-full flex items-center  justify-end">
              {" "}
              {activeOrder?.status == "ongoing" && (
                <AwaitingActionTag className="ml-auto" />
              )}
              {activeOrder?.status === "Confirm Pick Up" && (
                <HeadToPickUpTag className="ml-auto" />
              )}
            </div>

            <div className="space-y-4 mb-[50px] text-gray-600">
              <p className="flex items-center justify-between">
                <span className=" text-[14px]  leading-5  tracking-[-6%] text-[#525866]">
                  Order ID:
                </span>
                <span className="text-[14px] font-medium text-right leading-[20px] tracking-[-6%] text-[#0A0D14] ">
                {activeOrder?.order_id || "Order ID"}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-[14px] leading-5  tracking-[-6%] text-[#525866]">
                  Order Fare:
                </span>
                <span className="text-[14px] font-medium text-right leading-[20px] tracking-[-6%] text-[#0A0D14] ">
                NGN {activeOrder?.order_fare?.toLocaleString() || "0"}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-[14px] leading-5  tracking-[-6%] text-[#525866]">
                  Pickup Location:
                </span>
                <span className="text-[14px] font-medium text-right leading-[20px] tracking-[-6%] text-[#0A0D14] ">
                {activeOrder?.from_location || "Pickup location"}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-[14px] leading-5  tracking-[-6%] text-[#525866]">
                  Drop Off Location:
                </span>
                <span className="text-[14px] font-medium text-right leading-[20px] tracking-[-6%] text-[#0A0D14] ">
                {activeOrder?.to_location || "Dropoff location"}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-[14px] leading-5  tracking-[-6%] text-[#525866]">
                  Number of Stops:
                </span>
                <span className="text-[14px] font-medium text-right leading-[20px] tracking-[-6%] text-[#0A0D14] ">
                  0
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-[14px] leading-5  tracking-[-6%] text-[#525866]">
                  Order Description:
                </span>
                <span className="text-[14px] font-medium text-right leading-[20px] tracking-[-6%] text-[#0A0D14] ">
                  Document
                </span>
              </p>
              {/*
              <p className="flex items-center justify-between">
                <span className="text-[14px] leading-5  tracking-[-6%] text-[#525866]">
                  EST Time of Arrival
                </span>
                <div className="rounded-[6px] w-[75px] h-[24px] gap-[6px] flex justify-center items-center bg-[#EFFAF6]">
                  <Clock color="#38C793" size={12} />
                  <span className="text-[14px] leading-[16px] tracking-[-6%] text-[#38C793] font-medium">
                    17mins
                  </span>
                </div>
              </p>
              */}
              <p className="flex items-center justify-between">
                <span className="text-[14px] leading-5  tracking-[-6%] text-[#525866]">
                  EST Distance
                </span>
                <div className="rounded-[6px] w-[75px] h-[24px] gap-[6px] flex justify-center items-center bg-[#EFECFF]">
                  <Clock color="#2B1664" size={12} />
                  <span className="text-[14px] leading-[16px] tracking-[-6%] text-[#2B1664] font-medium">
                  {activeOrder?.distance ? activeOrder.distance.toFixed(0) : "N/A"} km
                  </span>
                </div>
              </p>
            </div>
            {orderStatus !== "completed" && (
                  <>
                    <Button
                      onClick={() => {
                        if (orderStatus === "ongoing") {
                          handleConfirmPickup(activeOrder?.order_id);
                        } else if (orderStatus === "picked") {
                          handleConfirmDelivery(activeOrder?.order_id);
                        }
                      }}
                      className="bg-[#00ABFD] text-white"
                    >
                      {orderStatus === "ongoing"
                        ? "Confirm Pick Up"
                        : orderStatus === "picked"
                        ? "Confirm Delivery"
                        : "Head to Pick Up"}
                    </Button>
                    <Button
                      onClick={() => {
                        setDetailsModalOpen(false);
                      }}
                      className="bg-[#fff] mt-[14px] text-[#00ABFD] hover:text-white"
                    >
                      Cancel Request
                    </Button>
                  </>
                )}
          </div>
          {customerNotified && <ArrivalNotification />}
        </div>
      </div>
      {phoneModalOpen && (
      <div 
        onClick={() => setPhoneModalOpen(false)}
        className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 w-[90%] max-w-md text-center space-y-6"
        >
          <h2 className="text-2xl font-bold text-[#1E2023]">Customer Phone Number</h2>
          <p className="text-lg text-gray-700">{activeOrder?.user_phone || "Phone number not available"}</p>
          
          <div className="flex flex-col gap-3">
            <a 
              href={`tel:${activeOrder?.user_phone}`} 
              className="bg-[#00ABFD] hover:bg-[#0090d6] text-white font-semibold py-3 rounded-lg transition"
            >
              Call Now
            </a>
            <button 
              onClick={() => setPhoneModalOpen(false)}
              className="border border-[#00ABFD] text-[#00ABFD] hover:bg-[#00ABFD] hover:text-white font-semibold py-3 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    {paymentPopupOpen && (
  <div
    onClick={() => setPaymentPopupOpen(false)}
    className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl p-6 w-[90%] max-w-md text-center space-y-6"
    >
      <h2 className="text-xl font-bold text-[#1E2023]">Confirm Payment</h2>
      <p className="text-gray-700">Have you received payment from the customer?</p>

      <div className="flex flex-col gap-3">
        <Button
          onClick={() => {
            setPaymentPopupOpen(false);
            setDetailsModalOpen(false);
          }}
          className="bg-[#00ABFD] text-white"
        >
          Yes, I have been paid
        </Button>
        <Button
          onClick={() => setPaymentPopupOpen(false)}
          className="border border-[#00ABFD] text-[#00ABFD]"
        >
          No, cancel
        </Button>
      </div>
    </div>
  </div>
)}


    </div>
  </>
  );
};

export const AwaitingActionTag = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        "rounded-[6px] _mr-auto mb-4 px-2 py-1  w-fit h-[24px] gap-[6px] flex justify-center items-center bg-[#FEF3EB]",
        className
      )}>
      <Clock color="white" fill="#F17B2C" size={16} />
      <span className="text-[14px] leading-[16px] tracking-[-6%] text-[#F17B2C] font-medium">
        Awaiting Action
      </span>
    </div>
  );
};
export const HeadToPickUpTag = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        "rounded-[6px] ml-auto mb-4 px-2 py-1  w-fit h-[24px] gap-[6px] flex justify-center items-center bg-[#EFECFF]",
        className
      )}>
      <Image src={bike} alt="bike" width={16} height={16} />
      <span className="text-[14px] leading-[16px] tracking-[-6%] text-[#2B1664] font-medium">
        Heading to pickup
      </span>
    </div>
  );
};

export const ArrivalNotification = () => {
  const totalSeconds = 10 * 60; // 10 minutes
  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progress = (secondsLeft / totalSeconds) * circumference;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="flex mt-[50px] items-center justify-center">
      {/* Circular Progress Indicator */}
      <div className="relative w-[70px] h-[70px] flex items-center justify-center">
        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
          <circle
            className="text-gray-300"
            stroke="currentColor"
            fill="transparent"
            strokeWidth="3"
            cx="18"
            cy="18"
            r="16"
          />
          <circle
            className="text-[#F17B2C] transition-all duration-300"
            stroke="currentColor"
            fill="transparent"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            cx="18"
            cy="18"
            r="16"
          />
        </svg>
        <span className="absolute text-xs font-bold text-gray-700">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Text Content */}
      <div className="ml-3 max-w-[153px] text-gray-700">
        <p className="text-[14px] leading-[19px] tracking-[-6%] mb-1.5 text-[#1E2023] font-medium">
          Customer has been notified of your arrival
        </p>
        <p className="text-[14px] leading-[16px] tracking-[-6%] text-[#00ABFD] font-medium">
          Waiting time: 10mins
        </p>
      </div>
    </div>
  );
};

