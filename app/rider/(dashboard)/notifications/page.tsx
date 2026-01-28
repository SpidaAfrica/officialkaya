import { redirect } from "next/navigation";

export default function NotificationsPage() {
  return redirect("notifications/all-notifications");
}
