"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Image from "next/image";
import { Switch } from "./switcyh";
import { ChevronDown } from "lucide-react";
import map from "../../../../assets/map.svg";
import herderImage from "../../../../assets/bg-header.png";
import { NewLocationDropDown } from "@/app/shared";

export const HeaderCard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Enter your present location");
  const [isAvailable, setIsAvailable] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const updateAvailabilityOnServer = async (lat: number, lng: number) => {
    const riderId = sessionStorage.getItem("rider_id");
    if (!riderId) {
      console.error("No rider ID found in sessionStorage.");
      return;
    }

    try {
      const response = await fetch("https://api.kaya.ng/kaya-api/rider/update-location.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rider_id: riderId,
          latitude: lat,
          longitude: lng,
          is_available: true,
        }),
      });

      const data = await response.json();
      console.log("Availability update response:", data);
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setIsAvailable(checked);
  
    if (checked) {
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ lat: latitude, lng: longitude });
  
            // Save coordinates to sessionStorage
            sessionStorage.setItem(
              "riderCoordinates",
              JSON.stringify({ lat: latitude, lng: longitude })
            );
  
            console.log("Current position:", latitude, longitude);
            updateAvailabilityOnServer(latitude, longitude);
          },
          (error) => {
            console.error("Error fetching geolocation:", error.message);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        console.error("Geolocation not supported or window is undefined.");
      }
    } else {
      setCoordinates(null);
  
      // Remove coordinates from sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("riderCoordinates");
      }
    }
  };
  

  const handleSelectLocation = (address: string, lat: number, lng: number) => {
    setSelectedLocation(address);
    setCoordinates({ lat, lng });
    console.log("New selected location:", address, lat, lng);
    // Optional: trigger backend update here if needed
  };

  return (
    <div className="h-fit lg:h-[250px] relative rounded-[10px] w-full bg-[#131515] pt-[35px] lg:pt-[45px] pb-[30px] lg:pb-[63px] px-[39px] lg:pl-[132px] lg:pr-[61px]">
      <div className="w-full absolute top-0 left-0 right-0 rounded-[10px] h-full overflow-clip">
        <Image
          src={herderImage}
          alt="header"
          width={1348}
          height={1098}
          className="absolute top-0 left-0 right-0 -bottom-[388px] w-full h-full object-cover"
        />
      </div>

      <div className="flex relative z-10 items-center justify-between">
        <p className="text-[32px] lg:text-[60px] leading-[37px] lg:leading-[68px] font-semibold text-white tracking-[-6%]">
          Ready to pick up?
        </p>

        <div className="hidden lg:flex gap-[14px] items-center">
          <p className="text-[22px] font-medium leading-[25px] tracking-[-6%] text-white">
            I’m Available
          </p>
          <Switch onChange={handleAvailabilityChange} />
        </div>
      </div>

      <div className="flex relative z-10 mb-[114px] lg:mb-auto lg:flex-row flex-col gap-[2.5px] lg:gap-0 mt-6 items-start lg:items-center">
        <div className="flex items-center">
          <Image
            src={map}
            alt="location-icon"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className="lg:text-[26px] text-[18px] font-semiBold lg:leading-[20px] leading-[15px] tracking-[-6%] text-white">
            {selectedLocation}
          </span>
        </div>

        <NewLocationDropDown onSelectLocation={handleSelectLocation}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-[218px] ml-2.5 cursor-pointer pl-[42px] flex items-center h-[50px] px-5 border border-[#E9F5FB] relative rounded"
          >
            <ChevronDown
              color="white"
              className="absolute left-[18px] top-1/2 -translate-y-1/2"
            />
            <div className="appearance-none flex items-center relative w-full h-full text-[14px] font-normal leading-[16px] tracking-[-4%] bg-transparent text-white">
              Change Location
            </div>
          </div>
        </NewLocationDropDown>
      </div>

      <div className="flex relative z-10 lg:hidden ml-auto gap-[14px] items-center justify-end">
        <p className="text-[22px] font-medium leading-[25px] tracking-[-6%] text-white">
          I’m Available
        </p>
        <Switch onChange={handleAvailabilityChange} />
      </div>
    </div>
  );
};
