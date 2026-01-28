"use client";
export const dynamic = "force-dynamic";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { OrderCard_1, SAVED_LOCATION_PAGES } from "@/app/shared";
import { AfroGirl } from "@/assets";
import NoRecentOrdersYet from "@/assets/no-recent-orders.svg";
import { DeliveryDetails_1 } from "@/components/Overlays/DeliveryDetails_1";
import {
  RefreshCcw
} from "lucide-react";
//import useAuth from "@/components/useAuth";



interface Delivery {
  id: number;
  created_at: string;
  to_location: string;
  delivery_id: string;
  price: string;
  status: string;
  rider: string;
  rider_image: string;
  rider_phone: string;
  rider_name: string;
  bank_name: string;
  account_number: string;
}

interface ApiResponse {
  status: string;
  data: Delivery[];
}

type PageParams = keyof typeof SAVED_LOCATION_PAGES;
export type PageParam = keyof typeof SAVED_LOCATION_PAGES;



const featuresData = [
  {
    icon: "💰",
    title: "Negotiable Standard Pricing",
    description: "Reliable service at a negotiable price that fits your budget. Deliver more for less! 💝",
  },
  {
    icon: "🚲",
    title: "Reliable and Vetted Riders",
    description: "Our parcels are in good hands — our riders are dependable, trained, and verified.",
  },
  {
    icon: "💳",
    title: "Easy Payment Options",
    description: "Seamless payments, zero stress. Fast, secure, and flexible! 💸",
  },
];

const Features: React.FC = () => (
  <div>
    <div className="px-6 py-12">
      <h2 className="text-2xl font-semibold text-[rgb(var(--foreground-rgb),1)] mb-8">Why Choose Us?</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {featuresData.map((feature, index) => (
          <div key={index} className="space-y-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-primary text-xl">{feature.icon}</span>
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-[rgb(var(--foreground-rgb),0.7)]">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
    <Image src={AfroGirl} alt="Afro Girl" className="min-h-80 object-cover w-full" />
  </div>
);

const HomePage: React.FC = () => {
  const [showLocations, setShowLocations] = useState(false);
  /*
  const isAuthenticated = useAuth(); // This will handle the redirect if not authenticated

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }
  */
  useEffect(() => {
    const timer = setTimeout(() => setShowLocations(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return showLocations ? <Locations /> : <Features />;
};

const Locations: React.FC = () => {
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageParams>("DELIVERY_DETAILS");
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

const switchPage = useCallback((page: string) => {
  setCurrentPage(page as PageParams); // safe cast here
}, []);


  const close = useCallback(() => {
    setShowDeliveryDetails(false);
  }, []);

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const handleCardClick = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowDeliveryDetails(true);
  };


  useEffect(() => {
    const fetchDeliveries = async () => {
      const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;

      if (!userId) {
        setFetchError("User ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://api.kaya.ng/kaya-api/get-deliveries.php?user_id=${userId}`);
        const data: ApiResponse = await response.json();

        if (data.status === "success") {
          setDeliveries(data.data);
        } else {
          setFetchError("Failed to fetch deliveries.");
        }
      } catch (error) {
        setFetchError("Error fetching deliveries.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();

    return () => {
      setDeliveries([]);
      setFetchError(null);
    };
  }, []);

  return (
    <div className="flex flex-col my-5 space-y-4">
      <div className="flex justify-between px-6">
        <Link href="/passenger/account/saved-locations" className="flex gap-2 items-center text-sm">
          <ArrowLeftIcon />
          View Saved Locations
        </Link>
        <button className="flex items-center gap-2 text-primary">
          <RefreshCcw /> {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <RecentOrdersSection
        loading={loading}
        fetchError={fetchError}
        deliveries={deliveries}
        showDeliveryDetails={showDeliveryDetails}
        setShowDeliveryDetails={setShowDeliveryDetails}
        onCardClick={handleCardClick}
        switchPage={switchPage}
        close={close}
        selectedDelivery={selectedDelivery}
      />
    </div>
  );
};

const RecentOrdersSection: React.FC<{
  loading: boolean;
  fetchError: string | null;
  deliveries: Delivery[];
  showDeliveryDetails: boolean;
  setShowDeliveryDetails: React.Dispatch<React.SetStateAction<boolean>>;
  switchPage: (page: PageParams) => void;
  close: () => void;
  onCardClick: (delivery: Delivery) => void;
  selectedDelivery: Delivery | null;
}> = ({ loading, fetchError, deliveries, showDeliveryDetails, setShowDeliveryDetails, switchPage, close, onCardClick, selectedDelivery }) => (
  <div className="w-[95%] mx-auto py-4 px-3 mt-2 bg-[#F3F3F3] rounded-xl">
    <h2 className="font-semibold text-lg text-[rgb(var(--foreground-rgb),1)]">Recent Orders</h2>
    {loading ? (
      <p className="text-gray-500">Loading...</p>
    ) : fetchError ? (
      <p className="text-red-500">{fetchError}</p>
    ) : deliveries.length > 0 ? (
      deliveries.map((delivery, index) => (
      <div key={index} onClick={() => onCardClick(delivery)} className="cursor-pointer">
        <OrderCard_1
          key={index}
          delivery={delivery}
          setShowDeliveryDetails={setShowDeliveryDetails}
          switchPage={switchPage as (page: string) => void}
        />
      </div>
      ))
    ) : (
      <div className="flex flex-col items-center justify-center py-12">
        {/*<Image src={NoRecentOrdersYet} alt="No orders" className="w-48 mb-4" />*/}
        <p className="text-gray-500 text-sm">You don’t have any orders yet.</p>
      </div>
    )}
   {showDeliveryDetails && selectedDelivery && (
  <DeliveryDetails_1 delivery={selectedDelivery} onClose={close} />
  )}
  </div>
);

const ArrowLeftIcon: React.FC = () => (
  <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.875 18.1803C5.60555 17.8915 3.53121 16.7494 2.07359 14.9861C0.615963 13.2229 -0.115561 10.9707 0.0276981 8.68747C0.170957 6.40421 1.17825 4.26118 2.84484 2.69393C4.51143 1.12668 6.71226 0.252838 9 0.250002C11.2905 0.248297 13.4956 1.12001 15.1657 2.68751C16.8359 4.25502 17.8456 6.40037 17.989 8.68642C18.1325 10.9725 17.3989 13.2272 15.9377 14.9912C14.4766 16.7551 12.3978 17.8956 10.125 18.1803V20.5135C14.5642 20.617 18 21.3269 18 22.1875C18 23.119 13.9703 23.875 9 23.875C4.02975 23.875 0 23.119 0 22.1875C0 21.3269 3.43575 20.617 7.875 20.5135V18.1803ZM9 11.5C9.59674 11.5 10.169 11.2629 10.591 10.841C11.0129 10.419 11.25 9.84674 11.25 9.25C11.25 8.65326 11.0129 8.08097 10.591 7.65901C10.169 7.23706 9.59674 7 9 7C8.40326 7 7.83097 7.23706 7.40901 7.65901C6.98705 8.08097 6.75 8.65326 6.75 9.25C6.75 9.84674 6.98705 10.419 7.40901 10.841C7.83097 11.2629 8.40326 11.5 9 11.5Z"
      fill="#1E2023"
    />
  </svg>
);

const ScheduleIcon: React.FC = () => (
  <svg className="w-6" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.3997 18.9498C5.18047 18.9498 0.949707 14.719 0.949707 9.4998C0.949707 4.28057 5.18047 0.0498047 10.3997 0.0498047C15.6189 0.0498047 19.8497 4.28057 19.8497 9.4998C19.8497 14.719 15.6189 18.9498 10.3997 18.9498ZM11.3447 9.4998V4.7748H9.45471V11.3898H15.1247V9.4998H11.3447Z"
      fill="#00ABFD"
    />
  </svg>
);

export default HomePage;
