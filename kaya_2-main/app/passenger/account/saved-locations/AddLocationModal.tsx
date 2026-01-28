"use client";
export const dynamic = "force-dynamic";

import React, {
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { SavedLocation } from "./types";
import { Work } from "@/components/svgs";
import { Home, MapPin, Timer, X } from "lucide-react";
import SuccessModal from "@/components/Overlays/SuccessModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (location: Omit<SavedLocation, "id">) => void;
}

export function AddLocationModal({
  isOpen,
  onClose,
  onAdd,
  children,
}: PropsWithChildren<AddLocationModalProps>) {
  const [address, setAddress] = useState("");
  const [locationType, setLocationType] = useState<"home" | "work" | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const GOOGLE_MAPS_API_KEY = "AIzaSyDeiTX6cfrRVrGA1wJnZh_ro957siC6A1c"; // 🔐 Replace with your real key

  const [suggestions] = useState([
    { name: "Albert Wigwe Road", address: "Lagos, Nigeria" },
    { name: "Richard Close", address: "Lagos, Nigeria" },
    { name: "Nnamdi Azikwe Road", address: "Lagos, Nigeria" },
  ]);

  // Load Google Maps JS dynamically with Autocomplete
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window.google === "object") return;

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => initAutocomplete();
      document.head.appendChild(script);
    };

    const initAutocomplete = () => {
      if (!inputRef.current || !window.google) return;
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "ng" },
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setAddress(place.formatted_address);
        } else if (place.name) {
          setAddress(place.name);
        }
      });
    };

    if (isOpen) {
      if (typeof window.google === "object") {
        initAutocomplete();
      } else {
        loadGoogleMapsScript();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setUserId(storedUserId || "1");
  }, []);

  const handleSubmit = async () => {
    if (!address || !locationType || !userId) return;

    const payload = new URLSearchParams({
      user_id: userId,
      name: address,
      address: "Nigeria",
      type: locationType,
    });

    try {
      const res = await fetch("https://api.kaya.ng/kaya-api/save-locations.php", {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await res.json();

      if (data.success) {
        onAdd({
          name: address,
          address: "Lagos, Nigeria",
          type: locationType,
        });
        setShowSuccess(true);
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Failed to save location", err);
    }
  };

  const toggleShowSuccess = useCallback(
    (state: boolean) => {
      setShowSuccess(state);
      onClose();
      setAddress("");
      setLocationType(null);
    },
    [onClose]
  );

  if (!isOpen && !showSuccess) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="bg-background rounded-2xl w-full max-w-lg">
          <DialogTitle className="hidden">title</DialogTitle>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add a New Location</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter a new address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#00ABFD]"
              />

              <div className="flex justify-between items-center">
                <p className="text-gray-600 mb-3">Set Location as :</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLocationType("home")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      locationType === "home"
                        ? "bg-[#00ABFD] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => setLocationType("work")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      locationType === "work"
                        ? "bg-[#00ABFD] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Work className="w-4 h-4" />
                    <span>Work</span>
                  </button>
                </div>
              </div>

              <button className="flex items-center gap-2 text-[#00ABFD]">
                <MapPin className="w-4 h-4" />
                <span>Choose Location on Map</span>
              </button>

              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => setAddress(suggestion.name)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <Timer className="w-5 h-5 text-[#F3A01C]" />
                    <div>
                      <p className="font-medium">{suggestion.name}</p>
                      <p className="text-sm text-gray-500">{suggestion.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={!address || !locationType} onClick={handleSubmit}>
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showSuccess && (
        <SuccessModal
          title="Location Saved! 📍"
          message="Your new location has been successfully added. Ready to use it for your next delivery!"
          showButton={true}
          onClose={() => toggleShowSuccess(false)}
        />
      )}
    </>
  );
}

/*"use client";
export const dynamic = "force-dynamic";

import React, { PropsWithChildren, useState, useCallback, useEffect } from "react";
import { SavedLocation } from "./types";
import { Work } from "@/components/svgs";
import { Home, MapPin, Timer, X } from "lucide-react";
import SuccessModal from "@/components/Overlays/SuccessModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (location: Omit<SavedLocation, "id">) => void;
}

export function AddLocationModal({
  isOpen,
  onClose,
  onAdd,
  children,
}: PropsWithChildren<AddLocationModalProps>) {
  const [address, setAddress] = useState("");
  const [locationType, setLocationType] = useState<"home" | "work" | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [suggestions] = useState([
    { name: "Albert Wigwe Road", address: "Lagos, Nigeria" },
    { name: "Richard Close", address: "Lagos, Nigeria" },
    { name: "Nnamdi Azikwe Road", address: "Lagos, Nigeria" },
  ]);

  // Access sessionStorage on the client-side only
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setUserId(storedUserId || "1"); // fallback to "1" if userId is not found
  }, []);

  const handleSubmit = async () => {
    if (!address || !locationType || !userId) return;

    const payload = new URLSearchParams({
      user_id: userId,
      name: address,
      address: "Nigeria",
      type: locationType,
    });

    try {
      const res = await fetch("https://api.kaya.ng/kaya-api/save-locations.php", {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await res.json();

      if (data.success) {
        onAdd({
          name: address,
          address: "Lagos, Nigeria",
          type: locationType,
        });
        setShowSuccess(true);
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Failed to save location", err);
    }
  };

  const toggleShowSuccess = useCallback(
    (state: boolean) => {
      setShowSuccess(state);
      onClose();
      setAddress("");
      setLocationType(null);
    },
    [onClose]
  );

  if (!isOpen && !showSuccess) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          title=""
          className="bg-background rounded-2xl w-full max-w-lg"
        >
          <DialogTitle className="hidden">title</DialogTitle>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add a New Location</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter a new address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#00ABFD]"
              />

              <div className="flex justify-between items-center">
                <p className="text-gray-600 mb-3">Set Location as :</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLocationType("home")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      locationType === "home"
                        ? "bg-[#00ABFD] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => setLocationType("work")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      locationType === "work"
                        ? "bg-[#00ABFD] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Work className="w-4 h-4" />
                    <span>Work</span>
                  </button>
                </div>
              </div>

              <button className="flex items-center gap-2 text-[#00ABFD]">
                <MapPin className="w-4 h-4" />
                <span>Choose Location on Map</span>
              </button>

              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => setAddress(suggestion.name)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <Timer className="w-5 h-5 text-[#F3A01C]" />
                    <div>
                      <p className="font-medium">{suggestion.name}</p>
                      <p className="text-sm text-gray-500">{suggestion.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={!address || !locationType} onClick={handleSubmit}>
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showSuccess && (
        <SuccessModal
          title="Location Saved! 📍"
          message="Your new location has been successfully added. Ready to use it for your next delivery!"
          showButton={true}
          onClose={() => toggleShowSuccess(false)}
        />
      )}
    </>
  );
}*/
