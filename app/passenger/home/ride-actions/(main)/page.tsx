"use client";
export const dynamic = "force-dynamic";
import AnimateInOut from "@/components/AnimateInOut";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CircularProgressBar,
  MessageIconSquare,
  MoneyIcon,
  NoDrivers,
  RiderAvatar,
  StarRating,
  Stars,
  Warn,
} from "@/assets";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/custom-select";
import { DeliveryDetails } from "@/components/Overlays/DeliveryDetails";
import SuccessModal from "@/components/Overlays/SuccessModal";
import { ChevronRight, Loader, Map, Phone, Slash, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";


export default function RideActionsPage() {
  const [fromLocation, setFromLocation] = useState<string | undefined>();
  const [toLocation, setToLocation] = useState<string | undefined>();
  const [price, setPrice] = useState<string | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
  const [senderPhone, setSenderPhone] = useState<string | undefined>();
  const [recipientPhone, setRecipientPhone] = useState<string | undefined>();
  const [packageDescription, setPackageDescription] = useState<string | undefined>();
  //const [packageId, setPackageId] = useState<string | undefined>();
    
  useEffect(() => {
  const getSessionValue = (key: string): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    return sessionStorage.getItem(key) ?? undefined;
  };

  setFromLocation(getSessionValue('fromLocation'));
  setToLocation(getSessionValue('toLocation'));
  setPrice(getSessionValue('price'));
  setPaymentMethod(getSessionValue('paymentMethod'));
  setSenderPhone(getSessionValue('senderPhone'));
  setRecipientPhone(getSessionValue('recipientPhone'));
  setPackageDescription(getSessionValue('packageDescription'));
}, []);
  return (
    <div className="flex flex-col-reverse md:flex-row gap-10">
      <div className="flex-1">
        <h3 className="font-medium">Trip Details</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 px-2">
            <div className="rounded-full h-fit p-3 bg-orange-tint/5">
              <Image src={MoneyIcon} alt="fare" className="w-6" />
            </div>
            <div className="border-b-[1px] border-b-foreground/10 py-3 flex-1">
              <p className="text-gray-400 font-medium text-sm">Order Price</p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-medium">{price}</p>
                <div className="flex items-center gap-1 py-1 px-2 rounded-lg outline outline-1 outline-gray-400/80 shadow">
                  <span>
                    <Slash className="stroke-background p-1 rounded-full bg-gray-400 w-4 h-4" />
                  </span>
                  <small className="font-medium text-gray-400">{paymentMethod}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-2">
            <div className="rounded-full h-fit p-3 bg-primary/5 text-primary">
              <Map />
            </div>
            <div className="border-b-[1px] border-b-foreground/10 py-3 flex-1">
              <p className="text-gray-400 font-medium text-sm">Origin</p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-medium">{fromLocation}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-2">
            <div className="rounded-full h-fit p-3 bg-primary/5 text-primary">
              <Map />
            </div>
            <div className="border-b-[1px] border-b-foreground/10 py-3 flex-1">
              <p className="text-gray-400 font-medium text-sm">Destination</p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-medium">{toLocation}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-2">
            <div className="rounded-full h-fit p-3 bg-primary/5">
              <Image src={Stars} alt="stars" />
            </div>
            <div className="border-b-[1px] border-b-foreground/10 py-3 flex-1">
              <p className="text-gray-400 font-medium text-sm">Order Details</p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-medium">
                  Sender: {senderPhone}
                  <br/>
                  Recipient: {recipientPhone}
                  <br/>
                  Package Description: {packageDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <DeliveryDetails>
              <Button>Back to delivery Details</Button>
            </DeliveryDetails>
            <CancelRequest />
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-xl bg-primary/5">
        {/* {loading ? (
          <div className="h-full w-full py-8 flex items-center justify-center">
            <Loader className="w-12 h-12 text-center text-primary animate-spin" />
          </div>
        ) : showRiderDetails ? (
          <AcceptedRiderDetails />
        ) : (
          <Image
            src={NoDrivers}
            alt="no-drivers"
            className="object-cover w-full h-full"
          />
          // <FareIncreaseInterface />
          // <RideSelectionInterface />
          // <Image
          //   src={NoDrivers}
          //   alt="no-drivers"
          //   className="object-cover w-full h-full"
          // />
        )} */}
        <RideActionSection />
      </div>
    </div>
  );
}

type RideState =
  | "available-rides"
  | "no-rides"
  | "rider-details"
  | "loading"
  | "increase-fare";

function RideActionSection() {
  const [rideState, setRideState] = useState<RideState>("loading");

  useEffect(() => {
    setTimeout(() => {
      setRideState("no-rides");
      setTimeout(() => {
        setRideState("increase-fare");
      }, 5000);
    }, 2000);
  }, []);

  switch (rideState) {
    case "loading":
      return (
        <div className="h-full w-full py-8 flex items-center justify-center">
          <Loader className="w-12 h-12 text-center text-primary animate-spin" />
        </div>
      );

    case "no-rides":
      return <NoRides />;

    case "increase-fare":
      return <FareIncreaseInterface setRideState={setRideState} />;

    case "available-rides":
      return <AvailableRides setRideState={setRideState} />;

    case "rider-details":
      return <AcceptedRiderDetails setRideState={setRideState} />;

    default:
      break;
  }
}

import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SendDriverMessageProps {
  riderPhone: string;
}

function SendDriverMessage({ riderPhone }: SendDriverMessageProps) {
  const [open, setOpen] = useState(false);

  const handleCall = () => {
    window.location.href = `tel:${riderPhone}`;
    setOpen(false);
  };
const [packageId, setPackageId] = useState(null);

  useEffect(() => {
    // Make sure this runs only in the browser
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');

      if (storedUserId) {
        getLatestPackage(storedUserId);
      } else {
        console.warn("User ID not found in localStorage");
      }
    }
  }, []);

  const getLatestPackage = async (userId: string) => {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);

      const response = await fetch('https://api.kaya.ng/kaya-api/get-package-id.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        console.log("Latest package_id:", data.package_id);
        setPackageId(data.package_id);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
  <>
    <div className="flex items-center bg-background p-3 gap-3 justify-between">
      {/* Chat link */}
      <Link href={`/passenger/chat/${packageId}`} className="flex items-center gap-3 flex-1">
        <div className="bg-[#B47818]/10 p-3 rounded-full">
          <Image src={MessageIconSquare} alt="message" />
        </div>
        <span>Send driver a message</span>
      </Link>

      {/* Phone modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button>
            <Phone className="fill-foreground/80 stroke-none" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogTitle>Call Rider</DialogTitle>
          <DialogDescription>
            Do you want to call the rider at <strong>{riderPhone}</strong>?
          </DialogDescription>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCall}>Call</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </>
  );
}

function CancelRequest() {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="text-primary">
          Cancel Request
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-background md:min-w-[45rem] rounded-2xl">
        <div className="w-full h-full relative  py-16">
          <DialogTrigger asChild className="absolute top-4 right-4">
            <button>
              <X />
            </button>
          </DialogTrigger>
          <div className="space-y-6">
            <div className="p-6 rounded-full bg-orange-tint/5 mx-auto w-fit">
              <Image src={Warn} alt="warn" />
            </div>

            <div className="px-2 flex flex-col items-center gap-3">
              <p className="text-center text-2xl font-medium">
                Please enter a reason for cancellation
              </p>
              <div className="w-full max-w-md px-8">
                <Select>
                  <SelectTrigger className="p-2 py-4 rounded-md outline outline-1 outline-foreground/20 focus:outline focus:outline-1 focus:outline-foreground/20">
                    <SelectValue placeholder="reason for cancellation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">No AC</SelectItem>
                    <SelectItem value="2">Karen</SelectItem>
                    <SelectItem value="3">Attack Helicopter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-1/2 mx-auto">
              <Button
                className="w-full"
                onClick={() => {
                  router.replace("/passenger/home");
                }}>
                Cancel Order
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RiderStatus({
  info,
  title,
  text,
}: {
  title: string;
  info: string;
  text?: string;
}) {
  return (
    <div>
      <div className="flex justify-between">
        <p className="font-medium">{title}</p>
        <span className="text-primary text-sm">{info}</span>
      </div>
      <p className="text-sm text-foreground/60 mt-2">{text}</p>
    </div>
  );
}




/*import { Star } from "lucide-react";


function AvailableRides({
  setRideState,
}: {
  setRideState: (state: RideState) => void;
}) {
  const [availableRiders, setAvailableRiders] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem("userId");
    const storedCords = sessionStorage.getItem("pickupCoords");
  
    if (storedId && storedCords) {
      setUserId(storedId);
      const { lat, lng } = JSON.parse(storedCords);
      fetchAvailableRiders(lat, lng, storedId); // pass storedId directly
    }
  }, []);


  const fetchAvailableRiders = async (pickupLat: number, pickupLng: number, userId: string) => {
    if (!userId) return alert("No user found.");
    try {
      const formData = new FormData();
      formData.append("pickup_lat", pickupLat.toString());
      formData.append("pickup_lng", pickupLng.toString());
      formData.append("user_id", userId);

      const response = await fetch("https://api.kaya.ng/kaya-api/get-nearby-riders.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        setAvailableRiders(data.riders);
      } else {
        console.error("Server error:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const acceptRide = async (userId: string, riderId: string) => {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("rider_id", riderId);
  
    const response = await fetch("https://api.kaya.ng/kaya-api/accept-ride-request.php", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
    if (data.status === "success") {
      console.log("Ride accepted.");
    } else {
      console.error("Error:", data.message);
    }
  };



  return (
    <div className="mx-auto px-4 max-h-96 flex flex-col">
      <header className="space-y-3 border-b py-3">
        <h3 className="font-medium text-xl">Available Rides</h3>
        <div className="flex items-center text-sm text-foreground mb-4 gap-2">
          <div className="flex items-center -space-x-5">
            {availableRiders?.image_url && (
              <Image
                src={availableRiders.image_url}
                alt="rider"
                width={48}
                height={48}
                className="w-12 aspect-square object-cover rounded-full bg-purple-300"
              />
            )}
          </div>
          <span className="font-medium"> are viewing request</span>
        </div>
      </header>

      <div className="space-y-4 pt-6 flex-1 overflow-y-auto">
        {availableRiders.map((ride, index) => (
          <div key={index} className="rounded-lg mb-4 overflow-hidden border">
            <div className="flex items-center p-4">
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">{ride.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-foreground/70">
                    {ride.rides} (rides)
                  </div>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(ride.rating)
                            ? "fill-current"
                            : "stroke-current"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-foreground/60">{ride.rating}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-right">
                  NGN {ride.price?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 text-right">
                  {ride.distance} km away
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1 w-[75%] ml-auto">
              <Button variant="outline">Decline</Button>
              <Button
                onClick={() => {
                  if (userId && ride.rider_id) {
                    acceptRide(userId, ride.rider_id);
                    setRideState("rider-details"); // Optional: move to rider details view after accepting
                  } else {
                    alert("User or Rider ID missing.");
                  }
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}*/

import { Star } from "lucide-react";


type Rider = {
  rider_id: string;
  fullName: string;
  image_url: string;
  rides: number;
  rating: number;
  price: number;
  distance: number;
};

function AvailableRides({
  setRideState,
}: {
  setRideState: (state: RideState) => void;
}) {
  const [availableRiders, setAvailableRiders] = useState<Rider[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem("userId");
    const storedCords = sessionStorage.getItem("pickupCoords");

    if (storedId && storedCords) {
      setUserId(storedId);
      const { lat, lng } = JSON.parse(storedCords);
      fetchAvailableRiders(lat, lng, storedId);
    }
  }, []);

  const fetchAvailableRiders = async (
    pickupLat: number,
    pickupLng: number,
    userId: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("pickup_lat", pickupLat.toString());
      formData.append("pickup_lng", pickupLng.toString());
      formData.append("user_id", userId);

      const response = await fetch(
        "https://api.kaya.ng/kaya-api/get-nearby-riders.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setAvailableRiders(data.riders);
      } else {
        console.error("Server error:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const acceptRide = async (userId: string, riderId: string) => {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("rider_id", riderId);

    const response = await fetch(
      "https://api.kaya.ng/kaya-api/accept-ride-request.php",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (data.status === "success") {
      console.log("Ride accepted.");
    } else {
      console.error("Error:", data.message);
    }
  };

  return (
    <div className="mx-auto px-4 max-h-96 flex flex-col">
      <header className="space-y-3 border-b py-3">
        <h3 className="font-medium text-xl">Available Rides</h3>
        {availableRiders.length > 0 && (
          <div className="flex items-center text-sm text-foreground mb-4 gap-2">
            <div className="flex items-center -space-x-5">
              {availableRiders.slice(0, 3).map((rider, i) => (
                <Image
                  key={i}
                  src={rider.image_url}
                  alt="rider"
                  width={48}
                  height={48}
                  className="w-12 aspect-square object-cover rounded-full border-2 border-white"
                />
              ))}
            </div>
            <span className="font-medium">are viewing request</span>
          </div>
        )}
      </header>

      <div className="space-y-4 pt-6 flex-1 overflow-y-auto">
        {availableRiders.map((ride, index) => (
          <div key={index} className="rounded-lg mb-4 overflow-hidden border">
            <div className="flex items-center p-4">
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">{ride.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-foreground/70">
                    {ride.rides} (rides)
                  </div>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(ride.rating)
                            ? "fill-current"
                            : "stroke-current"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-foreground/60">
                      {ride.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-right">
                  NGN {ride.price?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 text-right">
                  {ride.distance} km away
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1 w-[75%] ml-auto">
              <Button variant="outline">Decline</Button>
              <Button
                onClick={() => {
                  if (userId && ride.rider_id) {
                    acceptRide(userId, ride.rider_id);
                    setRideState("rider-details");
                  } else {
                    alert("User or Rider ID missing.");
                  }
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



function FareIncreaseInterface({
  setRideState,
}: {
  setRideState: (state: RideState) => void;
}) {
  const [fare, setFare] = useState(30000);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableRiders, setAvailableRiders] = useState<any[]>([]);
  
  useEffect(() => {
    const storedId = sessionStorage.getItem("userId");
    const storedCords = sessionStorage.getItem("pickupCoords");
  
    if (storedId && storedCords) {
      setUserId(storedId);
      const { lat, lng } = JSON.parse(storedCords);
      fetchAvailableRiders(lat, lng, storedId); // pass storedId directly
    }
  }, []);


  const decreaseFare = () => {
    setFare(prev => Math.max(0, prev - 1000));
  };

  const increaseFare = () => {
    setFare(prev => Math.min(prev + 1000, 100000));
  };

  
  const fetchAvailableRiders = async (pickupLat: number, pickupLng: number, userId: string) => {
    if (!userId) return alert("No user found.");
    try {
      const formData = new FormData();
      formData.append("pickup_lat", pickupLat.toString());
      formData.append("pickup_lng", pickupLng.toString());
      formData.append("user_id", userId);

      const response = await fetch("https://api.kaya.ng/kaya-api/get-nearby-riders.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        setAvailableRiders(data.riders);
      } else {
        console.error("Server error:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };


  const submitFareUpdate = async () => {
    if (!userId) return alert("No user found.");

    setLoading(true);
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("fare", String(fare));

    try {
      const res = await fetch("https://api.kaya.ng/kaya-api/passenger-update-fare.php", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        alert("Fare updated successfully!");
        setRideState("available-rides"); // move to next screen
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update fare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <header className="space-y-3 border-b py-3">
        <h3 className="font-medium text-xl">Available Rides</h3>
      
        {availableRiders.length > 0 ? (
          <div className="flex items-center text-sm text-foreground mb-4 gap-2">
            <div className="flex items-center -space-x-5">
              {availableRiders[0]?.image_url && (
                <Image
                  src={availableRiders[0].image_url}
                  alt="rider"
                  width={48}
                  height={48}
                  className="w-12 aspect-square object-cover rounded-full bg-purple-300"
                />
              )}
            </div>
            <span className="font-medium">are viewing request</span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic mb-4">
            No available riders at the moment.
          </div>
        )}
      </header>


      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 flex items-start space-x-3">
        <Info className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
        <div>
          <p className="text-yellow-900 font-semibold">
            NGN 30,000 might not be sufficient for the delivery riders.
          </p>
          <p className="text-yellow-800 text-sm">
            Kindly consider increasing your suggested price.
          </p>
        </div>
      </div>

      <div className="text-sm text-foreground/60 mb-2">Enter a new offer</div>

      <div className="flex items-center border rounded-lg">
        <button
          onClick={decreaseFare}
          className="p-3 text-xl font-bold text-primary hover:bg-blue-50 transition">
          −
        </button>
        <div className="flex-grow text-center font-semibold text-lg">
          NGN {fare.toLocaleString()}
        </div>
        <button
          onClick={increaseFare}
          className="p-3 text-xl font-bold text-primary hover:bg-blue-50 transition">
          +
        </button>
      </div>

      <div className="border-l-4 border-primary p-3 flex items-center space-x-3">
        <Info className="h-5 w-5 text-foreground/70 flex-shrink-0" />
        <p className="text-foreground/70 text-sm">
          Capped at ±N100 for your convenience!
        </p>
      </div>

      <Button
        disabled={loading}
        onClick={submitFareUpdate}
        className="w-full py-3 rounded-lg transition">
        {loading ? "Updating Fare..." : "Increase Fare"}
      </Button>
    </div>
  );
}


function CircularCountdown({ duration = 600 }: { duration?: number }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (timeLeft / duration) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#00ABFD"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <span className="mt-2 text-sm text-muted-foreground">
        {timeLeft}s remaining
      </span>
    </div>
  );
}


import { Dispatch, SetStateAction } from "react";

interface AcceptedRiderDetailsProps {
  setRideState: Dispatch<SetStateAction<RideState>>;
}

function AcceptedRiderDetails({ setRideState }: AcceptedRiderDetailsProps) {
  const [riderDetails, setRiderDetails] = useState<any>(null);
  const [rideArrived, setRideArrived] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    const formData = new FormData();
    formData.append("user_id", userId);

    fetch("https://api.kaya.ng/kaya-api/get-accepted-rider.php", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setRiderDetails(data.rider);
        } else {
          console.error(data.message);
        }
      });
  }, []);

  useEffect(() => {
    const arrivalTimer = setTimeout(() => {
      setRideArrived(true);
      const completeTimer = setTimeout(() => {
        setShowCompleted(true);
      }, 5000);
      return () => clearTimeout(completeTimer);
    }, 5000);
    return () => clearTimeout(arrivalTimer);
  }, []);

  if (!riderDetails) {
    return <p className="text-center py-8">Loading rider details...</p>;
  }

  return (
    <>
      <div className="w-[92%] mx-auto">
        <header className="py-2 border-b border-b-foreground/10">
          <h3>Rider Details</h3>
          <div className="flex items-center gap-2 pb-1 pt-3">
            <div className="rounded-full bg-purple-300">
              <Image
                src={riderDetails.image_url || "/default-avatar.jpg"}
                alt="rider"
                width={48}
                height={48}
                className="w-12 aspect-square object-cover rounded-full"
              />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between font-medium">
                <p>{riderDetails.fullName}</p>
                <p>{riderDetails.plate_number}</p>
              </div>
              <div className="flex items-center text-foreground/70 w-full text-sm">
                <div className="flex items-center gap-2">
                  <span>{riderDetails.rides} rides</span>
                  <span>⭐ {riderDetails.rating}</span>
                </div>
                <span className="ml-auto">{riderDetails.vehicle_type}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-4 py-3">
          <RiderStatus
            info={rideArrived ? "Your Rider Has Arrived🛵" : "EST Arrival 14mins"}
            title={
              rideArrived ? "Waiting time: 10mins" : "Your driver is on the way"
            }
            text={
              rideArrived
                ? `${riderDetails.fullName} has arrived and is ready to assist you with your delivery. Please head to the pickup point.`
                : undefined
            }
          />
          {rideArrived && (
            <div className="flex justify-center py-6">
              <CircularCountdown duration={600} />
            </div>
          )}

          <SendDriverMessage riderPhone={riderDetails.phone} />


          <div className="space-y-6">
            {!rideArrived && (
              <>
                <div className="flex items-center gap-3 text-primary">
                  <svg
                    width="24"
                    height="19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.125 13.25H9.875C8.02955 13.2493 6.21901 13.753 4.63911 14.7068C3.05921 15.6605 1.77005 17.0279 0.911002 18.6612C0.886855 18.3581 0.874846 18.0541 0.875001 17.75C0.875001 11.5366 5.91163 6.5 12.125 6.5V0.875L23.375 9.875L12.125 18.875V13.25Z"
                      fill="#00ABFD"
                    />
                  </svg>
                  <div className="flex-1">Share ride details</div>
                  <ChevronRight />
                </div>

                <div className="flex items-center gap-3 text-primary">
                  <svg
                    width="22"
                    height="25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.25 15.5335V24.25H2.90764e-07C-0.000348878 22.8762 0.313786 21.5206 0.918336 20.2871C1.52289 19.0535 2.4018 17.9747 3.48774 17.1333C4.57368 16.2919 5.83782 15.7103 7.1833 15.433C8.52877 15.1557 9.91987 15.1901 11.25 15.5335V15.5335ZM9 14.125C5.27062 14.125 2.25 11.1044 2.25 7.375C2.25 3.64562 5.27062 0.625 9 0.625C12.7294 0.625 15.75 3.64562 15.75 7.375C15.75 11.1044 12.7294 14.125 9 14.125ZM15.75 18.625V15.25H18V18.625H21.375V20.875H18V24.25H15.75V20.875H12.375V18.625H15.75Z"
                      fill="#00ABFD"
                    />
                  </svg>
                  <div className="flex-1">Request a new rider</div>
                  <ChevronRight />
                </div>
              </>
            )}
            <CancelRequest />
            <SuccessModal>
              <Button>Complete Order</Button>
            </SuccessModal>
          </div>
        </div>
      </div>

      {showCompleted && <SuccessModal />}
    </>
  );
}



function NoRides() {
  return (
    <Image
      src={NoDrivers}
      alt="no-drivers"
      className="object-cover w-full h-full"
    />
  );
}
