"use client";
export const dynamic = "force-dynamic";
import { cn } from "@/lib/utils";
import Image from "next/image";
import NavLink from "./Navlink";
import { useEffect, useState } from "react";
import { User } from "@/lib/icons";
import { Button } from "./ui/button";
import Link from "next/link";
import { Logo_main } from "@/assets";
import { SidebarTrigger } from "./ui/sidebar";
import ThemeToggle from "./ThemeToggle";

export const Header = ({
  userType = "passenger",
}: {
  userType?: "rider" | "passenger";
}) => {
  const [userData, setUserData] = useState<{
    email?: string;
    fullName?: string;
    user?: Record<string, any>;
    imageUrl?: string;
    userId?: string;
  }>({
    email: typeof window !== "undefined" ? sessionStorage.getItem("email") || "" : "",
    fullName: typeof window !== "undefined" ? sessionStorage.getItem("fullName") || "" : "",
    user: typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user") || "{}") : {},
    imageUrl: typeof window !== "undefined" ? sessionStorage.getItem("imageUrl") || "" : "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent running on the server

    const email = userData.email;
    if (!email) return;

    fetch("https://jbuit.org/api/get-user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setUserData((prevData) => ({ ...prevData, userId: data.id }));
        } else {
          console.error("User not found", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userData.email]); // Ensuring effect runs only when the email is available.

  return (
    <header className="w-full h-28 items-center backdrop-blur-md z-50">
      <div className={cn("w-[95%] h-full mx-auto flex justify-between items-center px-4")}>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Link href={`/${userType}/home`} className={""}>
            <Image
              src={Logo_main}
              alt="logo"
              width={720}
              height={720}
              className="object-cover w-24"
            />
          </Link>
          <div className={cn("hidden flex-[2] md:flex", false ? "font-normal" : "font-semibold")}>
            <div className="md:flex w-[80%] mx-auto justify-between items-center capitalize text-sm">
              <NavLink className="" href={`/${userType}/home`}>
                {({ isActive }) => (
                  <div className={cn("px-6 py-3  hover:bg-brand-7/40 rounded-md transition-all duration-200", isActive && "text-primary")}>
                    <p>home</p>
                  </div>
                )}
              </NavLink>
              <NavLink className="" href={`/${userType}/my-orders`}>
                {({ isActive }) => (
                  <div className={cn("px-6 py-3 hover:bg-brand-7/40 rounded-md transition-all duration-200", isActive && "text-primary")}>
                    <p>my orders</p>
                  </div>
                )}
              </NavLink>
              <NavLink className="" href={`/${userType}/wallet`}>
                {({ isActive }) => (
                  <div className={cn("px-6 py-3 hover:bg-brand-7/40 rounded-md transition-all duration-200", isActive && "text-primary")}>
                    <p>wallet</p>
                  </div>
                )}
              </NavLink>

              <NavLink className="" href={`/${userType}/account/settings`}>
                {({ isActive }) => (
                  <div className={cn("px-6 py-3 hover:bg-brand-7/40 rounded-md transition-all duration-200", isActive && "text-primary")}>
                    <p>account</p>
                  </div>
                )}
              </NavLink>
              <NavLink className="" href={`${
                userType === "passenger" ? "/rider/signin" : "/auth/signin"
              }`}>
                {({ isActive }) => (
                  <div className={cn("px-6 py-3 hover:bg-brand-7/40 rounded-md transition-all duration-200", isActive && "text-primary")}>
                    <p>{userType !== "rider" ? "become a courier" : "send a package"}</p>
                  </div>
                )}
              </NavLink>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <NavLink className="" href={`/${userType}/notifications/all-notifications`}>
            {({ isActive }) => (
              <div className={cn("w-12 h-12 flex items-center justify-center rounded-full", isActive && "bg-primary/10")}>
                {isActive ? (
                  <svg width="18" height="21" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17.1584 14.3254H19.0484V16.2154H0.148438V14.3254H2.03844V7.71039C2.03844 5.70535 2.83494 3.78244 4.25271 2.36466C5.67049 0.946888 7.5934 0.150391 9.59844 0.150391C11.6035 0.150391 13.5264 0.946888 14.9442 2.36466C16.3619 3.78244 17.1584 5.70535 17.1584 7.71039V14.3254ZM6.76344 18.1054H12.4334V19.9954H6.76344V18.1054Z"
                      fill="#00ABFD"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.98473 15.6708H15.2147V9.08508C15.2147 5.41564 12.2531 2.44078 8.59973 2.44078C4.94636 2.44078 1.98473 5.41564 1.98473 9.08508V15.6708ZM8.59973 0.550781C13.2964 0.550781 17.1047 4.37142 17.1047 9.08508V17.5608H0.0947266V9.08508C0.0947266 4.37142 3.90308 0.550781 8.59973 0.550781ZM6.23723 18.5058H10.9622C10.9622 19.1324 10.7133 19.7333 10.2703 20.1763C9.82721 20.6194 9.2263 20.8683 8.59973 20.8683C7.97315 20.8683 7.37224 20.6194 6.92919 20.1763C6.48613 19.7333 6.23723 19.1324 6.23723 18.5058Z"
                      fill={isActive ? "#00ABFD" : "#1D2939"}
                    />
                  </svg>
                )}
              </div>
            )}
          </NavLink>
          <NavLink className="" href={`/${userType}/chat`}>
            {({ isActive }) => (
              <div className={cn("w-12 h-12 flex items-center justify-center rounded-full", isActive && "bg-primary/10")}>
                {isActive ? (
                  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5.16017 15.6151L0.950195 18.9226V1.44012C0.950195 1.18949 1.04976 0.949123 1.22698 0.771901C1.4042 0.594679 1.64457 0.495117 1.8952 0.495117H18.9052C19.1558 0.495117 19.3962 0.594679 19.5734 0.771901C19.7506 0.949123 19.8502 1.18949 19.8502 1.44012V14.6701C19.8502 14.9207 19.7506 15.1611 19.5734 15.3383C19.3962 15.5156 19.1558 15.6151 18.9052 15.6151H5.16017ZM5.6752 7.11012V9.00012H7.5652V7.11012H5.6752ZM9.4552 7.11012V9.00012H11.3452V7.11012H9.4552ZM13.2352 7.11012V9.00012H15.1252V7.11012H13.2352Z"
                      fill={isActive ? "#00ABFD" : "#1D2939"}
                    />
                  </svg>
                ) : (
                  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5.15919 15.6161L0.949219 18.9236V1.44109C0.949219 1.19046 1.04878 0.9501 1.226 0.772878C1.40322 0.595656 1.64359 0.496094 1.89422 0.496094H18.9042C19.1548 0.496094 19.3952 0.595656 19.5724 0.772878C19.7497 0.9501 19.8492 1.19046 19.8492 1.44109V14.6711C19.8492 14.9217 19.7497 15.1621 19.5724 15.3393C19.3952 15.5165 19.1548 15.6161 18.9042 15.6161H5.15919ZM4.50525 13.7261H17.9592V2.38609H2.83922V15.0349L4.50525 13.7261ZM9.45422 7.11109H11.3442V9.00109H9.45422V7.11109ZM5.67422 7.11109H7.56422V9.00109H5.67422V7.11109ZM13.2342 7.11109H15.1242V9.00109H13.2342V7.11109Z"
                      fill="#1D2939"
                    />
                  </svg>
                )}
              </div>
            )}
          </NavLink>
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="w-8 h-8">
              {userData.imageUrl ? (
                <img
                  src={userData.imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User />
              )}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-lg font-semibold">Hello, {userData.fullName || userData.user?.fullName} 👋</span>
              <small className="text-xs text-foreground/60">{userData.email || userData.user?.email}</small>
            </div>
          </div>
          <div className="flex items-center justify-center md:hidden">
            <SidebarTrigger className=" ml-3 lg:hidden text-primary w-8 h-8" />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          {userData?.email ? (
            <Button
              onClick={() => {
                sessionStorage.clear();
                window.location.reload();
              }}
              className="px-6 !py-[0.15rem] bg-destructive text-white"
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button className="px-6 !py-[0.15rem]">Register</Button>
              <Button className="px-6 !py-[0.15rem] bg-background outline outline-2 outline-primary text-primary">
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
