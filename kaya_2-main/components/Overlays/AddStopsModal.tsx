"use client";

import { Actions, DetailsLayout } from "@/app/shared";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import DynamicOverlay from "./DynamicOverlay";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import FormInput from "../FormInput";
import DynamicTrigger from "./DynamicTrigger";

type Stop = {
  identifier: string;
  location: string;
  new: boolean;
};

const STORAGE_KEY = "dynamicStops";
const GOOGLE_API_KEY = "AIzaSyDeiTX6cfrRVrGA1wJnZh_ro957siC6A1c";

export default function AddStopsModal({
  actions,
  children,
  onOpenChange,
  open,
}: PropsWithChildren<{
  onOpenChange?(open: boolean): void;
  open?: boolean;
  actions?: Actions;
}>) {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [dynamicStops, setDynamicStops] = useState<Stop[]>([]);

  const isValidStop = (obj: any): obj is Stop =>
    obj && typeof obj.identifier === "string" && typeof obj.location === "string" && typeof obj.new === "boolean";

  useEffect(() => {
    if (typeof window !== "undefined" && open) {
      setFromLocation(sessionStorage.getItem("fromLocation") || "");
      setToLocation(sessionStorage.getItem("toLocation") || "");

      const stored = sessionStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      const validStops = Array.isArray(parsed) ? parsed.filter(isValidStop) : [];
      setDynamicStops(validStops);

      // Load Google Maps script once
      if (!document.querySelector("#google-maps-script")) {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [open]);

  const allStops: Stop[] = [
    { identifier: "Current Location", location: fromLocation, new: false },
    ...dynamicStops,
    { identifier: "Final Destination", location: toLocation, new: false },
  ];

  const handleAddStop = () => {
    const stopNumber = dynamicStops.length + 1;
    setDynamicStops((prev) => [
      ...prev,
      { identifier: `Stop ${stopNumber}`, location: "", new: true },
    ]);
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dynamicStops));
    }
    actions?.close?.();
  };

  const updateStopLocation = (index: number, value: string) => {
    setDynamicStops((prev) => {
      const updated = [...prev];
      updated[index].location = value;
      return updated;
    });
  };

  const removeStop = (index: number) => {
    setDynamicStops((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <DynamicOverlay onOpenChange={onOpenChange} open={open} trigger={children}>
      <DetailsLayout hide={() => actions?.close?.()} title="Add Stops">
        <div className="py-12">
          <div className="flex flex-col gap-4">
            {allStops.map((stop, index) => {
              const isDynamic = stop.new;
              const dynamicIndex = index - 1;

              return (
                <StopItem
                  key={index}
                  identifier={stop.identifier}
                  location={stop.location}
                  isNew={stop.new}
                  isEditable={isDynamic}
                  onChange={
                    isDynamic
                      ? (val) => updateStopLocation(dynamicIndex, val)
                      : undefined
                  }
                  onDelete={
                    isDynamic ? () => removeStop(dynamicIndex) : undefined
                  }
                />
              );
            })}
          </div>

          <Button
            onClick={handleAddStop}
            variant="ghost"
            className="text-primary gap-2 mt-5 w-fit"
          >
            <Plus />
            Add Additional Stop
          </Button>

          <DynamicTrigger>
            <Button className="mt-14" onClick={handleSave}>
              Save Stop Details
            </Button>
          </DynamicTrigger>
        </div>
      </DetailsLayout>
    </DynamicOverlay>
  );
}

function StopItem({
  identifier,
  location,
  isNew,
  isEditable,
  onChange,
  onDelete,
}: {
  identifier: string;
  location: string;
  isNew: boolean;
  isEditable: boolean;
  onChange?: (value: string) => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <StopIcon />
      <div className="space-y-1 w-full">
        <span className="text-sm text-foreground/70">{identifier}</span>
        {isEditable ? (
          <AutocompleteInput location={location} onChange={onChange} onDelete={onDelete} />
        ) : (
          <p>{location}</p>
        )}
      </div>
    </div>
  );
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8.00017 15.7137C3.73957 15.7137 0.285889 12.26 0.285889 7.99944C0.285889 3.73884 3.73957 0.285156 8.00017 0.285156C12.2608 0.285156 15.7145 3.73884 15.7145 7.99944C15.7145 12.26 12.2608 15.7137 8.00017 15.7137ZM8.00017 10.3137C8.61396 10.3137 9.20261 10.0699 9.63662 9.63589C10.0706 9.20188 10.3145 8.61323 10.3145 7.99944C10.3145 7.38566 10.0706 6.79701 9.63662 6.36299C9.20261 5.92898 8.61396 5.68516 8.00017 5.68516C7.38639 5.68516 6.79774 5.92898 6.36373 6.36299C5.92971 6.79701 5.68589 7.38566 5.68589 7.99944C5.68589 8.61323 5.92971 9.20188 6.36373 9.63589C6.79774 10.0699 7.38639 10.3137 8.00017 10.3137V10.3137Z"
        fill="#00ABFD"
      />
    </svg>
  );
}

function AutocompleteInput({
  location,
  onChange,
  onDelete,
}: {
  location: string;
  onChange?: (value: string) => void;
  onDelete?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
      types: ["geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange?.(place.formatted_address);
      }
    });
  }, [inputRef.current]);

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        ref={inputRef}
        className="w-full px-3 py-2 border rounded"
        defaultValue={location}
        placeholder="Enter stop location"
      />
      <button type="button" onClick={onDelete}>
        ❌
      </button>
    </div>
  );
}
/*import { Actions, DetailsLayout } from "@/app/shared";
import React, { PropsWithChildren, useEffect, useState } from "react";
import DynamicOverlay from "./DynamicOverlay";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import FormInput from "../FormInput";
import DynamicTrigger from "./DynamicTrigger";

type Stop = {
  identifier: string;
  location: string;
  new: boolean;
};

const STORAGE_KEY = "dynamicStops";

export default function AddStopsModal({
  actions,
  children,
  onOpenChange,
  open,
}: PropsWithChildren<{
  onOpenChange?(open: boolean): void;
  open?: boolean;
  actions?: Actions;
}>) {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [dynamicStops, setDynamicStops] = useState<Stop[]>([]);

  // Validate structure
  const isValidStop = (obj: any): obj is Stop =>
    obj &&
    typeof obj.identifier === "string" &&
    typeof obj.location === "string" &&
    typeof obj.new === "boolean";

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && open) {
        setFromLocation(sessionStorage.getItem("fromLocation") || "");
        setToLocation(sessionStorage.getItem("toLocation") || "");

        const stored = sessionStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        const validStops = Array.isArray(parsed)
          ? parsed.filter(isValidStop)
          : [];
        setDynamicStops(validStops);
      }
    } catch (err) {
      console.error("Error loading from sessionStorage:", err);
      setDynamicStops([]);
    }
  }, [open]);

  const allStops: Stop[] = [
    { identifier: "Current Location", location: fromLocation, new: false },
    ...dynamicStops,
    { identifier: "Final Destination", location: toLocation, new: false },
  ];

  const handleAddStop = () => {
    const stopNumber = dynamicStops.length + 1;
    setDynamicStops((prev) => [
      ...prev,
      { identifier: `Stop ${stopNumber}`, location: "", new: true },
    ]);
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dynamicStops));
    }
    actions?.close?.();
  };

  const updateStopLocation = (index: number, value: string) => {
    setDynamicStops((prev) => {
      const updated = [...prev];
      updated[index].location = value;
      return updated;
    });
  };

  const removeStop = (index: number) => {
    setDynamicStops((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <DynamicOverlay onOpenChange={onOpenChange} open={open} trigger={children}>
      <DetailsLayout hide={() => actions?.close?.()} title="Add Stops">
        <div className="py-12">
          <div className="flex flex-col gap-4">
            {allStops.map((stop, index) => {
              const isDynamic = stop.new;
              const dynamicIndex = index - 1; // Because first is fromLocation
            
              return (
                <StopItem
                  key={index}
                  identifier={stop.identifier}
                  location={stop.location}
                  isNew={stop.new}
                  isEditable={isDynamic}
                  onChange={
                    isDynamic
                      ? (val) => updateStopLocation(dynamicIndex, val)
                      : undefined
                  }
                  onDelete={
                    isDynamic ? () => removeStop(dynamicIndex) : undefined
                  }
                />
              );
            })}
          </div>

          <Button
            onClick={handleAddStop}
            variant="ghost"
            className="text-primary gap-2 mt-5 w-fit"
          >
            <Plus />
            Add Additional Stop
          </Button>

          <DynamicTrigger>
            <Button className="mt-14" onClick={handleSave}>
              Save Stop Details
            </Button>
          </DynamicTrigger>
        </div>
      </DetailsLayout>
    </DynamicOverlay>
  );
}

// Reusable StopItem component
function StopItem({
  identifier,
  location,
  isNew,
  isEditable,
  onChange,
  onDelete,
}: {
  identifier: string;
  location: string;
  isNew: boolean;
  isEditable: boolean;
  onChange?: (value: string) => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <StopIcon />
      <div className="space-y-1 w-full">
        <span className="text-sm text-foreground/70">{identifier}</span>
        {isEditable ? (
          <EditableStopField
            location={location}
            onChange={onChange}
            onDelete={onDelete}
          />
        ) : (
          <p>{location}</p>
        )}
      </div>
    </div>
  );
}

// Icon component for stops
function StopIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.00017 15.7137C3.73957 15.7137 0.285889 12.26 0.285889 7.99944C0.285889 3.73884 3.73957 0.285156 8.00017 0.285156C12.2608 0.285156 15.7145 3.73884 15.7145 7.99944C15.7145 12.26 12.2608 15.7137 8.00017 15.7137ZM8.00017 10.3137C8.61396 10.3137 9.20261 10.0699 9.63662 9.63589C10.0706 9.20188 10.3145 8.61323 10.3145 7.99944C10.3145 7.38566 10.0706 6.79701 9.63662 6.36299C9.20261 5.92898 8.61396 5.68516 8.00017 5.68516C7.38639 5.68516 6.79774 5.92898 6.36373 6.36299C5.92971 6.79701 5.68589 7.38566 5.68589 7.99944C5.68589 8.61323 5.92971 9.20188 6.36373 9.63589C6.79774 10.0699 7.38639 10.3137 8.00017 10.3137V10.3137Z"
        fill="#00ABFD"
      />
    </svg>
  );
}

// Editable Stop Field
function EditableStopField({
  location,
  onChange,
  onDelete,
}: {
  location: string;
  onChange?: (value: string) => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <FormInput
        className="w-full"
        outerClassName="w-full"
        value={location ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <button onClick={onDelete}>❌</button>
    </div>
  );
}

*/
{/*import { Actions, DetailsLayout } from "@/app/shared";
import React, { PropsWithChildren, useEffect, useState } from "react";
import DynamicOverlay from "./DynamicOverlay";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import FormInput from "../FormInput";
import DynamicTrigger from "./DynamicTrigger";

type Stop = {
  identifier: string;
  location: string;
  new: boolean;
};

const STORAGE_KEY = "dynamicStops";

export default function AddStopsModal({
  actions,
  children,
  onOpenChange,
  open,
}: PropsWithChildren<{
  onOpenChange?(open: boolean): void;
  open?: boolean;
  actions?: Actions;
}>) {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [dynamicStops, setDynamicStops] = useState<Stop[]>([]);

  // Load from sessionStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined" && open) {
      setFromLocation(sessionStorage.getItem("fromLocation") || "");
      setToLocation(sessionStorage.getItem("toLocation") || "");
      const stored = sessionStorage.getItem(STORAGE_KEY);
      setDynamicStops(stored ? JSON.parse(stored) : []);
    }
  }, [open]);

  const allStops: Stop[] = [
    { identifier: "Current Location", location: fromLocation, new: false },
    ...dynamicStops,
    { identifier: "Final Destination", location: toLocation, new: false },
  ];

  const handleAddStop = () => {
    const stopNumber = dynamicStops.length + 1;
    setDynamicStops((prev) => [
      ...prev,
      { identifier: `Stop ${stopNumber}`, location: "", new: true },
    ]);
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dynamicStops));
    }
    actions?.close?.();
  };

  const updateStopLocation = (index: number, value: string) => {
    setDynamicStops((prev) => {
      const updated = [...prev];
      updated[index].location = value;
      return updated;
    });
  };

  const removeStop = (index: number) => {
    setDynamicStops((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <DynamicOverlay onOpenChange={onOpenChange} open={open} trigger={children}>
      <DetailsLayout hide={() => actions?.close?.()} title="Add Stops">
        <div className="py-12">
          <div className="flex flex-col gap-4">
            {allStops.map((stop, index) => (
              <StopItem
                key={index}
                identifier={stop.identifier}
                location={stop.location}
                isNew={stop.new}
                isEditable={stop.new}
                onChange={(val) => updateStopLocation(index, val)}
                onDelete={() => removeStop(index)}
              />
            ))}
          </div>

          <Button
            onClick={handleAddStop}
            variant="ghost"
            className="text-primary gap-2 mt-5 w-fit"
          >
            <Plus />
            Add Additional Stop
          </Button>

          <DynamicTrigger>
            <Button className="mt-14" onClick={handleSave}>
              Save Stop Details
            </Button>
          </DynamicTrigger>
        </div>
      </DetailsLayout>
    </DynamicOverlay>
  );
}

// Reusable StopItem component
function StopItem({
  identifier,
  location,
  isNew,
  isEditable,
  onChange,
  onDelete,
}: {
  identifier: string;
  location: string;
  isNew: boolean;
  isEditable: boolean;
  onChange?: (value: string) => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <StopIcon />
      <div className="space-y-1 w-full">
        <span className="text-sm text-foreground/70">{identifier}</span>
        {isEditable ? (
          <EditableStopField
            location={location}
            onChange={onChange}
            onDelete={onDelete}
          />
        ) : (
          <p>{location}</p>
        )}
      </div>
    </div>
  );
}

// Icon component for stops
function StopIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.00017 15.7137C3.73957 15.7137 0.285889 12.26 0.285889 7.99944C0.285889 3.73884 3.73957 0.285156 8.00017 0.285156C12.2608 0.285156 15.7145 3.73884 15.7145 7.99944C15.7145 12.26 12.2608 15.7137 8.00017 15.7137ZM8.00017 10.3137C8.61396 10.3137 9.20261 10.0699 9.63662 9.63589C10.0706 9.20188 10.3145 8.61323 10.3145 7.99944C10.3145 7.38566 10.0706 6.79701 9.63662 6.36299C9.20261 5.92898 8.61396 5.68516 8.00017 5.68516C7.38639 5.68516 6.79774 5.92898 6.36373 6.36299C5.92971 6.79701 5.68589 7.38566 5.68589 7.99944C5.68589 8.61323 5.92971 9.20188 6.36373 9.63589C6.79774 10.0699 7.38639 10.3137 8.00017 10.3137V10.3137Z"
        fill="#00ABFD"
      />
    </svg>
  );
}

// Editable Stop Field
function EditableStopField({
  location,
  onChange,
  onDelete,
}: {
  location: string;
  onChange?: (value: string) => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <FormInput
        className="w-full"
        outerClassName="w-full"
        defaultValue={location}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <button onClick={onDelete}>❌</button>
    </div>
  );
}
*/}
