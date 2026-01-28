import React from "react";
import { X, MapPin, Home, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationModal = ({ isOpen, onClose }: LocationModalProps) => {
  const [locationType, setLocationType] = React.useState<"home" | "work">();

  const locations = [
    { id: 1, name: "Albert Wigwe Road", city: "Lagos, Nigeria" },
    { id: 2, name: "Richard Close", city: "Lagos, Nigeria" },
    { id: 3, name: "Nnamdi Azikwe Road", city: "Lagos, Nigeria" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between border-b bg-red-950">
          <DialogTitle className="text-lg font-semibold]">
            Add a New Location
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Address Input */}
          <input
            type="text"
            placeholder="Enter a new address"
            className="w-full p-3 bg-gray-50 rounded-lg border-0 placeholder-gray-400"
          />

          {/* Location Type Selection */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Set Location as :</span>
            <button
              onClick={() => setLocationType("home")}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                locationType === "home"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}>
              <Home className="h-4 w-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setLocationType("work")}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                locationType === "work"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}>
              <Building2 className="h-4 w-4" />
              <span>Work</span>
            </button>
          </div>

          {/* Map Option */}
          <button className="flex items-center space-x-2 text-blue-500 font-medium">
            <MapPin className="h-5 w-5" />
            <span>Choose Location on Map</span>
          </button>

          {/* Location Suggestions */}
          <div className="space-y-2">
            {locations.map((location) => (
              <button
                key={location.id}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <div className="text-left">
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-gray-500">{location.city}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              Discard
            </button>
            <button className="flex-1 py-3 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              Apply Changes
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;
