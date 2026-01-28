"use client";
export const dynamic = "force-dynamic";
import { NotificationsLayout } from "@/app/shared";
import React, { PropsWithChildren } from "react";

const userType = "rider";
const route = "notifications";

const NOTIFICATIONS_LINKS = [
  {
    title: "All Notifications",
    url: `/${userType}/${route}/all-notifications`,
  },
  {
    title: "Orders",
    url: `/${userType}/${route}/orders`,
  },

  {
    title: "Payments",
    url: `/${userType}/${route}/payments`,
  },
];

export default function RiderNotificationsLayout({
  children,
}: PropsWithChildren) {
  return (
    <NotificationsLayout links={NOTIFICATIONS_LINKS}>
      {children}
    </NotificationsLayout>
  );
}
