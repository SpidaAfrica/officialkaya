'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { DeliveryDetails } from '@/components/Overlays/DeliveryDetails';
import { Button } from '@/components/ui/button';

// Dynamically load MapWithRoute to avoid SSR issues
const MapWithRoute = dynamic(() => import('@/components/Overlays/MapWithRoute'), {
  ssr: false,
});

export default function BigMapPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const [showDetails, setShowDetails] = useState(false);

  if (!from || !to) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Missing map parameters. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="relative w-[90%] mx-auto my-8 h-[50vh] rounded-lg overflow-hidden">
      {/* Map Component */}
      <MapWithRoute from={from} to={to}/>

      {/* Toggle Button */}
      <Button
        onClick={() => setShowDetails((prev) => !prev)}
        className="bg-black w-fit absolute top-4 left-4 hover:bg-gray-700 text-white flex items-center gap-2"
      >
        <svg
          width="14"
          height="12"
          viewBox="0 0 14 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.09844 6.00024H2.19844V3.00024H0.998437V1.80024H4.59844V3.00024H3.39844V4.67724L9.28624 3.09984L8.93824 1.80024H6.99844V0.600244H9.38524C9.51956 0.59728 9.65099 0.639485 9.75847 0.720098C9.86596 0.80071 9.94327 0.915065 9.97804 1.04484L10.9098 4.52244L9.75064 4.83264L9.59704 4.25904L3.09844 6.00024ZM2.79844 10.2002C3.1167 10.2002 3.42192 10.0738 3.64697 9.84877C3.87201 9.62373 3.99844 9.3185 3.99844 9.00024C3.99844 8.68198 3.87201 8.37676 3.64697 8.15172C3.42192 7.92667 3.1167 7.80024 2.79844 7.80024C2.48018 7.80024 2.17495 7.92667 1.94991 8.15172C1.72487 8.37676 1.59844 8.68198 1.59844 9.00024C1.59844 9.3185 1.72487 9.62373 1.94991 9.84877C2.17495 10.0738 2.48018 10.2002 2.79844 10.2002ZM2.79844 11.4002C2.16192 11.4002 1.55147 11.1474 1.10138 10.6973C0.651294 10.2472 0.398438 9.63676 0.398438 9.00024C0.398438 8.36372 0.651294 7.75327 1.10138 7.30319C1.55147 6.8531 2.16192 6.60024 2.79844 6.60024C3.43496 6.60024 4.04541 6.8531 4.49549 7.30319C4.94558 7.75327 5.19844 8.36372 5.19844 9.00024C5.19844 9.63676 4.94558 10.2472 4.49549 10.6973C4.04541 11.1474 3.43496 11.4002 2.79844 11.4002ZM10.5984 10.2002C11.0758 10.2002 11.5337 10.0106 11.8712 9.67304C12.2088 9.33547 12.3984 8.87763 12.3984 8.40024C12.3984 7.92285 12.2088 7.46502 11.8712 7.12745C11.5337 6.78989 11.0758 6.60024 10.5984 6.60024C10.121 6.60024 9.66321 6.78989 9.32564 7.12745C8.98808 7.46502 8.79844 7.92285 8.79844 8.40024C8.79844 8.87763 8.98808 9.33547 9.32564 9.67304C9.66321 10.0106 10.121 10.2002 10.5984 10.2002ZM10.5984 11.4002C9.80279 11.4002 9.03973 11.0842 8.47712 10.5216C7.91451 9.95896 7.59844 9.19589 7.59844 8.40024C7.59844 7.60459 7.91451 6.84153 8.47712 6.27892C9.03973 5.71631 9.80279 5.40024 10.5984 5.40024C11.3941 5.40024 12.1571 5.71631 12.7198 6.27892C13.2824 6.84153 13.5984 7.60459 13.5984 8.40024C13.5984 9.19589 13.2824 9.95896 12.7198 10.5216C12.1571 11.0842 11.3941 11.4002 10.5984 11.4002Z"
            fill="white"
          />
        </svg>
        <span className="font-semibold text-sm">Delivery Details</span>
      </Button>

      {/* Bottom Overlay */}
      {showDetails && (
        <div className="absolute bottom-0 left-0 w-full bg-white shadow-lg z-50 max-h-[50%] overflow-y-auto">
          <DeliveryDetails />
        </div>
      )}
    </div>
  );
}
