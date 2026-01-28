"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { Timer, Home, Work } from "@/components/svgs";
import { SavedLocation } from "./types";
import { Plus } from "lucide-react";
import { AddLocationModal } from "./AddLocationModal";
import { Button } from "@/components/ui/button";

export default function SavedLocationsPage() {
  const [locations, setLocations] = React.useState<SavedLocation[]>([]); 
  const [isModalOpen, setIsModalOpen] = React.useState(false); 

  // ✅ Fetch saved locations on component mount
  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Check if we're on the client before using sessionStorage
        const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") || "1" : "1";
        const res = await fetch(`https://api.kaya.ng/kaya-api/get-locations.php?user_id=${userId}`);
        const data = await res.json();
  
        if (data.success && Array.isArray(data.locations)) {
          const last10 = data.locations.slice(-10); 
          setLocations(last10);
        } else {
          console.error("Error fetching locations:", data.message);
        }
      } catch (err) {
        console.error("Failed to load locations", err);
      }
    };
  
    fetchLocations();
  }, []);

  // ✅ Save new location
  const handleAddLocation = async (newLocation: Omit<SavedLocation, "id">) => {
    try {
      // Check if we're on the client before using sessionStorage
      const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") || "1" : "1";
      
      const res = await fetch("https://api.kaya.ng/kaya-api/save-locations.php", {
        method: "POST",
        body: new URLSearchParams({
          user_id: userId,
          name: newLocation.name,
          address: newLocation.address,
          type: newLocation.type || "other", 
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await res.json();

      if (data.success) {
        setLocations((prev) => [
          ...prev,
          {
            ...newLocation,
            id: data.id || String(prev.length + 1), 
          },
        ]);
        setIsModalOpen(false); 
      } else {
        console.error("Failed to save location:", data.message);
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const splitLocations = React.useMemo(() => {
    if (locations.length <= 5) {
      return { leftColumn: locations, rightColumn: [] };
    }

    const midPoint = Math.ceil(locations.length / 2);
    return {
      leftColumn: locations.slice(0, midPoint),
      rightColumn: locations.slice(midPoint),
    };
  }, [locations]);

  const LocationItem = ({ location }: { location: SavedLocation }) => (
    <div className="flex items-start gap-3 py-4 border-b border-[#E5E7EB]">
      <div className="w-6 h-6 mt-1">
        <Timer className="w-full h-full text-[#F3A01C]" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[#1A1A1A] text-base font-normal">{location.name}</h3>
            <p className="text-[#666666] text-sm mt-0.5">{location.address}</p>
          </div>
          {(location.type === "home" || location.type === "work") && (
            <div className="flex items-center gap-2 bg-[#F9FAFB] px-3 py-1.5 rounded-full">
              {location.type === "home" ? (
                <Home className="w-4 h-4" />
              ) : (
                <Work className="w-4 h-4" />
              )}
              <span className="text-[#666666] text-sm capitalize">
                {location.type}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full my-12 max-w-[90%] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-[1.75rem] text-[#111111] font-medium leading-tight">
            Saved Locations
          </h2>
          <p className="text-[#666666] text-base mt-1">
            Manage your saved locations
          </p>
        </div>
        <Button
          variant={"ghost"}
          onClick={() => setIsModalOpen(true)}
          className="w-auto text-primary"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Location</span>
        </Button>
        <AddLocationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddLocation}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
        <div className="divide-y divide-[#E5E7EB] px-4 sm:px-6 lg:px-8">
          {splitLocations.leftColumn.map((location) => (
            <LocationItem key={location.id} location={location} />
          ))}
        </div>

        {splitLocations.rightColumn.length > 0 && (
          <div className="divide-y divide-[#E5E7EB] px-4 sm:px-6 lg:px-8">
            {splitLocations.rightColumn.map((location) => (
              <LocationItem key={location.id} location={location} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
