"use client";
import { useEffect, useState } from "react";
import { Actions, DetailsLayout, ViewMapInFullMode } from "@/app/shared";
import { MoneyIcon, Stars } from "@/assets";
import { Dot, Edit3, Plus } from "lucide-react";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import DynamicOverlay from "./DynamicOverlay";
import { SuggestPrice } from "./SuggestPrice";
import { OrderDetails } from "./OrderDetails";
import MapWithRoute from "./MapWithRoute";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export const dynamic = "force-dynamic";

interface Stop {
  identifier: string;
  location: string;
  new: boolean;
}

type Package = {
  from_location: string;
  to_location: string;
  pickup_lat: number;
  pickup_lon: number;
  dropoff_lat: number;
  dropoff_lon: number;
  package_category: string;
  package_description: string;
  price: string;
  payment_method: string;
  sender_phone: string;
  recipient_phone: string;
  dynamic_stops: Stop[];
  user_id: string;
};

export function DeliveryDetails({
  actions,
  children,
  onOpenChange,
  open,
  withMoreActions = true,
  type = "delivery",
}: {
  actions?: Actions;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  withMoreActions?: boolean;
  type?: "delivery" | "order";
}) {
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  {/*  useEffect(() => {
    if (typeof window === "undefined") return;

    const safeGet = (key: string, fallback = "") => {
      const value = sessionStorage.getItem(key);
      return value !== null && value.trim() !== "" ? value : fallback;
    };
    
    const safeParse = (key: string, fallback: any) => {
      try {
        return JSON.parse(sessionStorage.getItem(key) || JSON.stringify(fallback));
      } catch {
        return fallback;
      }
    };

    const loadData = () => {
      const pickupCoordsRaw = safeParse("pickupCoords", null);
      const dropoffCoordsRaw = safeParse("dropoffCoords", null);
    
      const pickupCoords = pickupCoordsRaw && typeof pickupCoordsRaw === "object" ? pickupCoordsRaw : { lat: 0, lon: 0 };
      const dropoffCoords = dropoffCoordsRaw && typeof dropoffCoordsRaw === "object" ? dropoffCoordsRaw : { lat: 0, lon: 0 };
    
      const stops = safeParse("dynamicStops", []);
    
      const data: Package = {
        from_location: safeGet("fromLocation"),
        to_location: safeGet("toLocation"),
        pickup_lat: typeof pickupCoords.lat === "number" ? pickupCoords.lat : 0,
        pickup_lon: typeof pickupCoords.lng === "number" ? pickupCoords.lng : 0,
        dropoff_lat: typeof dropoffCoords.lat === "number" ? dropoffCoords.lat : 0,
        dropoff_lon: typeof dropoffCoords.lng === "number" ? dropoffCoords.lng : 0,
        dynamic_stops: stops,
        payment_method: safeGet("paymentMethod", "online-payment"),
        user_id: safeGet("userId"),
        package_category: safeGet("packageCategory"),
        package_description: safeGet("packageDescription"),
        price: safeGet("price"),
        sender_phone: safeGet("senderPhone"),
        recipient_phone: safeGet("recipientPhone"),
      };
    
      if (!data.from_location && !data.to_location) {
        console.warn("Essential data missing. User needs to fill form manually.");
        setPackageData(null);
      } else {
        setPackageData(data);
      }
      setLoading(false);
    };
    
    loadData();
  }, []);
  */}
  const loadPackageData = () => {
    const safeGet = (key: string, fallback = "") => {
      const value = sessionStorage.getItem(key);
      return value !== null && value.trim() !== "" ? value : fallback;
    };
  
    const safeParse = (key: string, fallback: any) => {
      try {
        return JSON.parse(sessionStorage.getItem(key) || JSON.stringify(fallback));
      } catch {
        return fallback;
      }
    };
  
    const pickupCoordsRaw = safeParse("pickupCoords", null);
    const dropoffCoordsRaw = safeParse("dropoffCoords", null);
  
    const pickupCoords = pickupCoordsRaw && typeof pickupCoordsRaw === "object" ? pickupCoordsRaw : { lat: 0, lon: 0 };
    const dropoffCoords = dropoffCoordsRaw && typeof dropoffCoordsRaw === "object" ? dropoffCoordsRaw : { lat: 0, lon: 0 };
  
    const stops = safeParse("dynamicStops", []);
  
    const data: Package = {
      from_location: safeGet("fromLocation"),
      to_location: safeGet("toLocation"),
      pickup_lat: typeof pickupCoords.lat === "number" ? pickupCoords.lat : 0,
      pickup_lon: typeof pickupCoords.lng === "number" ? pickupCoords.lng : 0,
      dropoff_lat: typeof dropoffCoords.lat === "number" ? dropoffCoords.lat : 0,
      dropoff_lon: typeof dropoffCoords.lng === "number" ? dropoffCoords.lng : 0,
      dynamic_stops: stops,
      payment_method: safeGet("paymentMethod", "online-payment"),
      user_id: safeGet("userId"),
      package_category: safeGet("packageCategory"),
      package_description: safeGet("packageDescription"),
      price: safeGet("price"),
      sender_phone: safeGet("senderPhone"),
      recipient_phone: safeGet("recipientPhone"),
    };
  
    if (!data.from_location && !data.to_location) {
      console.warn("Essential data missing. User needs to fill form manually.");
      setPackageData(null);
    } else {
      setPackageData(data);
    }
  
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    loadPackageData();
  }, []);


  const handleSubmit = async () => {
    if (!packageData) {
      alert("Please fill in the delivery details before submitting.");
      return;
    }

    try {
      const response = await fetch("https://api.kaya.ng/kaya-api/create-package.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          user_id: packageData.user_id,
          from_location: packageData.from_location,
          to_location: packageData.to_location,
          package_category: packageData.package_category,
          package_description: packageData.package_description,
          price: packageData.price,
          payment_method: packageData.payment_method,
          sender_phone: packageData.sender_phone,
          recipient_phone: packageData.recipient_phone,
          dynamic_stops: JSON.stringify(packageData.dynamic_stops),
          pickup_lat: String(packageData.pickup_lat),
          pickup_lon: String(packageData.pickup_lon),
          dropoff_lat: String(packageData.dropoff_lat),
          dropoff_lon: String(packageData.dropoff_lon),
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Package created successfully!");
        router.push("/passenger/home/ride-actions");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Package submission failed:", error);
      alert("There was an error submitting the package.");
    }
  };

  const updatePaymentMethod = (method: string) => {
    if (!packageData) return;
    sessionStorage.setItem("paymentMethod", method);
    setPackageData({ ...packageData, payment_method: method });
  };

  return (
    <DynamicOverlay onOpenChange={onOpenChange} open={open} trigger={children}>
      <DetailsLayout hide={() => actions?.close?.()} title={type === "delivery" ? "Delivery Details" : "Order Details"}>
        {loading && <p className="text-center text-gray-400 p-4">Loading your delivery details...</p>}

        {!loading && packageData && (
          <>
            <div className="w-full relative">
              <MapWithRoute from={packageData.from_location} to={packageData.to_location} />
              <ViewMapInFullMode userType="passenger" fromLocation={packageData.from_location} toLocation={packageData.to_location} />
            </div>

            <div className="space-y-4">
              <DetailRow label="Current Location" value={packageData.from_location} />
              <DetailRow label="Destination" value={packageData.to_location} />
              <DetailRow label="Price" value={packageData.price || "Not Set"} />
              <DetailRow label="Payment Method" value={packageData.payment_method} />
              <DetailRow label="Sender Phone" value={packageData.sender_phone || "Not Set"} />
              <DetailRow label="Recipient Phone" value={packageData.recipient_phone || "Not Set"} />
              <DetailRow label="Number of stops" value={`${packageData.dynamic_stops.length}`} />
            </div>
          </>
        )}

        {/* Always show the action buttons */}
        <div className="mt-4 space-y-3">
          <OrderDetails actions={actions} onOpenChange={onOpenChange} open={open} onDataChanged={loadPackageData}>
            <button className="flex items-center gap-2 text-primary">
              <Image src={Stars} alt="stars" />
              <p>Enter Order Details</p>
              <Plus />
            </button>
          </OrderDetails>

          <SuggestPrice actions={actions} onOpenChange={onOpenChange} open={open} onDataChanged={loadPackageData}>
            <button className="flex w-full px-3 py-4 gap-2 rounded-md bg-orange-tint/[7%] justify-between">
              <div className="rounded-full p-3 bg-orange-tint/5">
                <Image src={MoneyIcon} alt="fare" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                  <p className="font-semibold">Suggest Price</p>
                  {/*
                  <span className="font-semibold flex bg-background text-xs text-gray-400 border-gray-400 border pr-2 rounded-full">
                    <Dot /> #25000
                    Standard
                  </span>
                  */}
                </div>
                <p className="text-foreground/60 text-left">Tap to suggest a new fare</p>
              </div>
              <Edit3 />
            </button>
          </SuggestPrice>

          <PaymentMethodSelector paymentMethod={packageData?.payment_method || "online-payment"} setPaymentMethod={updatePaymentMethod} />
          {/*
          <AutoAcceptRiderSwitch />
          */}
          <ConfirmDeliveryButton onClick={handleSubmit} />
        </div>
      </DetailsLayout>
    </DynamicOverlay>
  );
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <p className="text-gray-400">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const PaymentMethodSelector = ({
  paymentMethod,
  setPaymentMethod,
}: {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}) => (
  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex gap-4">
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="online-payment" id="online-payment" />
      <Label htmlFor="online-payment">Online Payment</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="cash" id="cash" />
      <Label htmlFor="cash">Cash</Label>
    </div>
  </RadioGroup>
);

const AutoAcceptRiderSwitch = () => (
  <div className="flex items-center bg-primary/10 p-4 rounded-md">
    <p className="flex-1">Automatically accept nearest rider for NGN25,000</p>
    <Switch />
  </div>
);

const ConfirmDeliveryButton = ({ onClick }: { onClick: () => void }) => (
  <DialogTrigger asChild>
    <Button onClick={onClick} className="w-full">
      <Link href="/passenger/home/">Confirm Delivery</Link>
    </Button>
  </DialogTrigger>
);
