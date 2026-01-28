"use client";
export const dynamic = "force-dynamic";
import React, { useCallback } from "react";
import clsx from "clsx";
// import Image, { StaticImageData } from "next/image";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NavLink from "./Navlink";
import AnimateInOut from "./AnimateInOut";

type NavLinkType = {
  //   icon: StaticImageData;
  title: string;
  href: string;
};

const NAV_LINKS: NavLinkType[] = [
  {
    href: "/passenger/home",
    // icon: HomeMain,
    title: "Home",
  },
  {
    href: "/passenger/my-orders",
    // icon: Orders,
    title: "My Orders",
  },
  {
    href: "/passenger/chat",
    // icon: Message-icon-square,
    title: "Message",
  },
  {
    href: "/passenger/wallet",
    // icon: DesktopIcon,
    title: "Wallet",
  },
  {
    href: "/passenger/account",
    // icon: Installation,
    title: "Account",
  },
  {
    href: "/passenger/become-a-courier",
    // icon: Faq,
    title: "Become a courier",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const menu = searchParams.get("menu");

  const showSidebar = menu === "true";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const hideMenu = useCallback(() => {
    router.push(pathname + "?" + createQueryString("menu", "false"));
  }, [createQueryString, pathname, router]);

  return (
    <>
      <AnimateInOut
        show={showSidebar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={hideMenu}
        className="w-full h-svh fixed lg:hidden top-0 left-0 backdrop-blur-sm overscroll-none z-40"
      />
      <aside
        className={clsx(
          "w-72 sm:w-96 absolute lg:static h-full lg:bg-transparent py-4 z-40 bg-background border-r-[1px] border-r-white/[10%] transitison-transform duration-100 md:hidden",
          showSidebar
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0 delay-300"
        )}>
        <div className="w-full mx-auto h-full flex flex-col">
          <div className="space-y-2 flex-1">
            {NAV_LINKS.map(({ href, title }, i) => (
              <div key={i} className="w-full">
                <NavLink href={href}>
                  {({ isActive }) => (
                    <div
                      className={clsx(
                        "flex items-center gap-4 relative px-2 pl-6 h-16 after:h-0 after:transition-all transition-all after:duration-500 duration-500",
                        isActive &&
                          "after:absolute after:h-16 after:w-1 after:bg-primary after:left-0 bg-white/10"
                      )}>
                      {/* <Image
                        src={icon}
                        alt="home"
                        className="w-6 h-6 object-cover"
                      /> */}
                      <p
                        className={clsx(
                          "text-lg capitalize_ font-medium text-foreground"
                        )}>
                        {title}
                      </p>
                    </div>
                  )}
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
