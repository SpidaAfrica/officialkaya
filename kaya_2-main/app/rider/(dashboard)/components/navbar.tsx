"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import menu from "../../../../assets/menu.svg";
import message from "../../../../assets/message.svg";
import profile from "../../../../assets/profile.png";
import logo from "../../../../assets/apago-blue-1.png";
import notificationicon from "../../../../assets/notification.svg";

export const Navbar = () => {
  const NavLinks = [
    {
      name: "Home",
      href: "/rider/home",
    },
    {
      name: "My Orders",
      href: "/rider/my-orders",
    },
    {
      name: "Wallet",
      href: "/rider/wallet",
    },
    {
      name: "Account",
      href: "/rider/account",
    },
    {
      name: "Send a package",
      href: "/rider/send-package",
    },
  ];
  const pathname = usePathname();
  return (
    <nav className=" flex px-[21px] lg:px-auto justify-between h-[72px] lg:h-[50px] lg:justify-between">
      <Image
        src={logo}
        alt="logo"
        width={121}
        className=" object-contain"
        height={30}
      />

      <div className=" hidden lg:flex items-center gap-[60px] ">
        {NavLinks.map((link) => (
          <Link
            className={cn(
              " text-[16px] font-medium leading-5 tracking-[-2%] ",
              pathname === link.href && "text-primary"
            )}
            href={link.href}
            key={link.name}>
            {link.name}
          </Link>
        ))}
      </div>

      <div className=" hidden lg:flex  gap-[26px] items-center">
        <Image
          src={notificationicon}
          alt="notification icon"
          width={25}
          height={25}
        />
        <Image src={message} alt="message" width={25} height={25} />
      </div>

      <div className=" flex items-center gap-4 lg:gap-2">
        <Image
          src={profile}
          alt="profile"
          className=" lg:size-[50px] size-[27px]"
          width={50}
          height={50}
        />
        <div className="hidden lg:flex flex-col gap-[2px]">
          <p className=" text-[24px] text-[#0A0D14] font-[600] leading-[27px] tracking-[-6%]">
            Meji02
          </p>
          <p className=" text-[14px] font-normal text-[#8A8A8C] leading-[16px] tracking-[-2%]">
            Taiwo02@gmail.com
          </p>
        </div>
        <Image
          src={menu}
          className=" lg:hidden"
          alt="menu"
          width={30}
          height={30}
        />
      </div>
    </nav>
  );
};
