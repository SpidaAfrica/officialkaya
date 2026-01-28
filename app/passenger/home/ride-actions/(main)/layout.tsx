'use client';

import React, { PropsWithChildren, useEffect, useState } from 'react';
import MapWithRoute from '@/components/Overlays/MapWithRoute';
// import { HeroMap } from "@/assets"; // Uncomment if needed
import { ViewMapInFullMode } from '@/app/shared';

export default function RideActionsLayout({ children }: PropsWithChildren) {
  const [fromLocation, setFromLocation] = useState<string | undefined>();
  const [toLocation, setToLocation] = useState<string | undefined>();

  useEffect(() => {
    const getSessionValue = (key: string): string | undefined => {
      if (typeof window === 'undefined') return undefined;
      return sessionStorage.getItem(key) ?? undefined;
    };

    setFromLocation(getSessionValue('fromLocation'));
    setToLocation(getSessionValue('toLocation'));
  }, []);

  console.log("FROM:", fromLocation, "TO:", toLocation);

  const renderMap = () =>
    fromLocation && toLocation ? (
      <MapWithRoute from={fromLocation} to={toLocation} />
    ) : null;

  return (
    <div className="w-[95%] mx-auto py-4">
      {/* Desktop map view */}
      <div className="hidden md:block mx-auto relative">
        {renderMap()}
      </div>

      {/* Mobile map view */}
      <div className="md:hidden">
        {renderMap()}
      </div>

      {/* Main content */}
      <div className="md:w-[95%] mx-auto flex flex-col md:flex-row gap-10 items-stretch my-8">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
