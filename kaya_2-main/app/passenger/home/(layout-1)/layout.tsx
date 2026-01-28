"use client";
export const dynamic = "force-dynamic";
import { DeliveryBottomCorner } from "@/assets";
import Image from "next/image";
import React, { PropsWithChildren } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";

import Link from "next/link";
import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
//import useAuth from "@/components/useAuth";

export default function HomeLayout({ children }: PropsWithChildren) {
  /*
  const isAuthenticated = useAuth(); // This will handle the redirect if not authenticated

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }
  */
  return (
    <div className="w-full">
      <Hero />
      <div className="md:w-[95%] mx-auto flex flex-col md:flex-row gap-10 items-stretch my-8">
        <div className="flex-1">{children}</div>
        <HowItWorks />
      </div>
    </div>
  );
}

const HowItWorks = () => {
  const swiperItem = useMemo(
    () => (
      <>
        <div className="relative z-20 space-y-4 w-[60%] m-8">
          <h4 className="text-[#E9B14D] text-3xl font-semibold">
            Deliveries Made Easy! 📦✨
          </h4>
          <div className="space-y-3 text-[#634903]">
            <p>Sign up today and get ₦500 off your first order!</p>
            <Link href={"/auth/signup"} className="flex gap-2 items-center">
              <span className="underline">Get Started Now</span>
              <ArrowRight />
            </Link>
          </div>
        </div>
        <Image
          src={DeliveryBottomCorner}
          alt="delivery slide"
          className="absolute bottom-0 right-0 object-cover"
        />
      </>
    ),
    []
  );

  return (
    <div className="flex flex-col">
      <div className="flex-[4] bg-[#FEFAEF] rounded-lg overflow-clip w-[95%] md:w-[30rem] self-center">
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
          className="w-full !h-full min-h-96"
          wrapperClass="w-full !h-96 md:h-full">
          <SwiperSlide className="relative !h-full">{swiperItem}</SwiperSlide>
          <SwiperSlide className="relative !h-full">{swiperItem}</SwiperSlide>
          <SwiperSlide className="relative !h-full">{swiperItem}</SwiperSlide>
        </Swiper>
      </div>
      <div className="flex-[2] px-6 py-12 mt-6 mx-auto outline outline-1 outline-gray-200/20 rounded-lg w-[95%] md:w-full">
        <h2 className="text-2xl font-semibold text-[rgb(var(--foreground-rgb),0.7)] mb-3 ">
          How It Works
        </h2>
        <div className="space-y-4 divide-y divide-gray-200/20">
          <div className="flex items-center space-x-3 pt-3">
            <span className="text-primary">🚀</span>
            <p>Enter delivery details.</p>
          </div>
          <div className="flex items-center space-x-3 pt-3">
            <span className="text-primary">🚀</span>
            <p>Choose a rider.</p>
          </div>
          <div className="flex items-center space-x-3 pt-3">
            <span className="text-primary">🚀</span>
            <p>Track your order in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
