"use client";
export const dynamic = "force-dynamic";

import React, { PropsWithChildren } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Logo_main, OnboardingImageOne, OnboardingImageTwo } from "@/assets";
import { cn } from "@/lib/utils";

export default function AuthForm({
  children,
  showCarousel = true,
}: PropsWithChildren<{ showCarousel?: boolean }>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div
        className={cn(
          "flex flex-col gap-4 p-6 md:p-10 flex-1",
          !showCarousel && "col-span-2"
        )}>
        <Image
          src={Logo_main}
          alt={"logo"}
          className="relative top-0 w-32"
        />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs_">{children}</div>
        </div>
      </div>
      {showCarousel && (
        <div className="relative hidden from-bg-primary/10 bg-gradient-to-tr from-primary/10 to-primary/5 lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-7">
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
                  src={OnboardingImageOne}
                  alt={"onboarding"}
                  className="w-full h-full object-cover"
                />
                <div className="w-full h-full absolute z-50 bottom-0 bg-gradient-to-b from-transparent via-transparent to-primary flex flex-col justify-end">
                  <div className="h-[30%] text-white">
                    <p className="text-balance text-center text-3xl">
                      Effortless Delivery in Just a Few Taps
                    </p>
                    <p className="text-balance text-center">
                      Book, negotiate, pay, and track your parcel from anywhere.
                      Our app makes delivery as easy as it should be.
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="{!shrink} md:!shrink-0 py-4 px-2 md:py-0 md:px-0 !flex items-center justify-center">
                <Image
                  src={OnboardingImageTwo}
                  alt={"onboarding"}
                  className="w-full h-full object-cover"
                />
                <div className="w-full h-full absolute z-50 bottom-0 bg-gradient-to-b from-transparent via-transparent to-primary flex flex-col justify-end">
                  <div className="h-[30%] text-white">
                    <p className="text-balance text-center text-3xl">
                      Effortless Delivery in Just a Few Taps
                    </p>
                    <p className="text-balance text-center">
                      Book, negotiate, pay, and track your parcel from anywhere.
                      Our app makes delivery as easy as it should be.
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
