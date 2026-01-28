"use client";
export const dynamic = "force-dynamic";

import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import Image from "next/image";
import React, { PropsWithChildren } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Logo_main,
  RiderOnboardingImageOne,
  RiderOnboardingImageTwo,
} from "@/assets";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";

export default function AuthForm({
  children,
  showCarousel = true,
}: PropsWithChildren<{ showCarousel?: boolean }>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div
        className={cn(
          "bg-white flex flex-col gap-4 p-6 md:p-10",
          !showCarousel && "col-span-2"
        )}>
        <Image
          src={Logo_main}
          alt={"logo"}
          className="relative top-0 w-32"
        />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[400px]., TIN9MYQ708">{children}</div>
        </div>
      </div>
      {/* images */}
      {showCarousel && (
        <div className="relative hidden from-bg-primary/10 bg-gradient-to-tr from-[#008BCD00] to-[#008BCD] lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-7">
          <div className="w-full h-full">
            <Swiper
              autoplay={{
                delay: 3000,
                pauseOnMouseEnter: false,
                disableOnInteraction: false,
              }}
              speed={1000}
              loop={true}
              modules={[Autoplay, Navigation, Pagination]}
              grabCursor
              pagination
              className="flex w-full h-full"
              wrapperClass="w-full h-full">
              <SwiperSlide className="w-full h-full relative">
                <Image
                  src={RiderOnboardingImageOne}
                  alt={"onboarding"}
                  className="w-full h-full object-cover"
                />
                <div className="w-full h-full absolute z-50 bottom-0 bg-gradient-to-b from-transparent via-transparent to-primary flex flex-col justify-end">
                  <div className="h-[30%] text-white">
                    <p className="text-balance text-center text-3xl">
                      Earn More, Stress Less
                    </p>
                    <p className="text-balance text-center">
                      With instant order notifications, navigation tools, and
                      secure payouts, we make delivering seamless and rewarding.
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="{!shrink} md:!shrink-0 py-4 px-2 md:py-0 md:px-0 !flex items-center justify-center">
                <Image
                  src={RiderOnboardingImageTwo}
                  alt={"onboarding"}
                  className="w-full h-full object-cover"
                />
                <div className="w-full h-full absolute z-50 bottom-0 bg-gradient-to-b from-transparent via-transparent to-primary flex flex-col justify-end">
                  <div className="h-[30%] text-white">
                    <p className="text-balance text-center text-3xl">
                      Stay in Control of Your Deliveries
                    </p>
                    <p className="text-balance text-center">
                      Choose orders, set your availability, and track your
                      progress effortlessly. Our app puts you in charge.
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
}
