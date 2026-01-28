"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Logo_main } from "@/assets";
import { cn } from "@/lib/utils";
import AnimateInOut from "./AnimateInOut";
import NavLink from "./Navlink";
import clsx from "clsx";
import { User } from "@/lib/icons";

const SIDEBAR_ITEMS = [
  { url: "home", title: "Home" },
  { url: "my-orders", title: "My Orders" },
  { url: "chat", title: "Messages" },
  { url: "notifications/all-notifications", title: "Notifications" },
  { url: "wallet", title: "Wallet" },
  { url: "account", title: "Account" },
];

type UserInfo = {
  fullName?: string;
  email?: string;
  imageUrl?: string;
  userId?: string;
};

export function AppSidebar({
  userType,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userType: "rider" | "passenger" }) {
  const pathname = usePathname();
  const { open, toggleSidebar } = useSidebar();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const email = sessionStorage.getItem("email");
    const fullName = sessionStorage.getItem("fullName");
    const imageUrl = sessionStorage.getItem("imageUrl");

    let user: any = {};
    try {
      user = JSON.parse(sessionStorage.getItem("user") || "{}");
    } catch (err) {
      console.error("Failed to parse user:", err);
    }

    if (email) {
      fetch("https://api.kaya.ng/kaya-api/get-user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.id) {
            sessionStorage.setItem("userId", data.id);
            setUserInfo({
              fullName: fullName || user.fullName,
              email: email || user.email,
              imageUrl: imageUrl || user.imageUrl || user.image_url,
              userId: data.id,
            });
          } else {
            console.error("User not found", data);
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        });
    } else {
      setUserInfo({
        fullName: fullName || user.fullName,
        email: email || user.email,
        imageUrl: imageUrl || user.imageUrl || user.image_url,
      });
    }
  }, []);

// 🚫 Avoid SSR crash
if (!isClient || !userInfo) {
  return null; // silently skip rendering without UI
}


  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className={cn("py-4 bg-background-deep lg:hidden", props.className)}
    >
      <SidebarHeader className="bg-background-deep relative px-8">
        <Link href="/">
          <AnimateInOut
            show={open}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Image src={Logo_main} alt="logo" className="w-20 object-cover" />
          </AnimateInOut>

          <div className="flex items-center gap-2 py-12">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              {userInfo.imageUrl ? (
                <img
                  src={userInfo.imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold">
                Hello, {userInfo.fullName} 👋
              </span>
              <small className="text-xs text-foreground/60">{userInfo.email}</small>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-background-deep">
        <SidebarMenu className="space-y-4 px-2 capitalize">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname.includes(`/${item.url}`);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={toggleSidebar}
                  className="py-6 px-0 rounded-none"
                  isActive={isActive}
                  asChild
                >
                  <NavLink href={`/${userType}/${item.url}`}>
                    {({ isActive }) => (
                      <div
                        className={clsx(
                          "flex items-center gap-4 relative px-2 pl-6 h-16 after:h-0 after:transition-all transition-all after:duration-500 duration-500",
                          isActive &&
                            "after:absolute after:h-16 after:w-1 after:bg-primary after:left-0 bg-white/10"
                        )}
                      >
                        <p className="text-lg font-medium text-foreground">
                          {item.title}
                        </p>
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              className="py-6 px-0 rounded-none"
              asChild
            >
              <NavLink href={`/${userType === "passenger" ? "rider" : "auth"}/signin`}>
                {({ isActive }) => (
                  <div
                    className={clsx(
                      "flex items-center gap-4 relative px-2 pl-6 h-16 after:h-0 after:transition-all transition-all after:duration-500 duration-500",
                      isActive &&
                        "after:absolute after:h-16 after:w-1 after:bg-primary after:left-0 bg-white/10"
                    )}
                  >
                    <p className="text-lg font-medium text-foreground">
                      {userType !== "rider" ? "become a courier" : "send a package"}
                    </p>
                  </div>
                )}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
