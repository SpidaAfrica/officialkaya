'use client';

import { useEffect, useRef, useState } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyDeiTX6cfrRVrGA1wJnZh_ro957siC6A1c"; // Replace with your Google Maps API key

type MapWithRouteProps = {
  from?: string;
  to?: string;
};

export default function MapWithRoute({ from, to }: MapWithRouteProps) {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!from || !to || !mapElement.current) return;

      const map = new google.maps.Map(mapElement.current, {
        zoom: 12,
        center: { lat: 0, lng: 0 }, // Will be set properly below
      });

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({ map });

      const result = await directionsService.route({
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (result.routes.length > 0) {
        directionsRenderer.setDirections(result);

        const leg = result.routes[0].legs[0];
        setEstimatedTime(leg.duration?.text || null);

        // Center the map on the route
        map.setCenter(leg.start_location);
      }
    };

    if (typeof window !== "undefined" && (window as any).google?.maps) {
      initializeMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    }
  }, [from, to]);

  return (
    <div className="w-full">
      {estimatedTime && (
        <p className="text-center font-medium mb-2">
          Estimated Arrival Time: {estimatedTime}
        </p>
      )}
      <div
        ref={mapElement}
        className="w-full h-[50vh] rounded-lg overflow-hidden"
      />
    </div>
  );
}
