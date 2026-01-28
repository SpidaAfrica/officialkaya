"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/custom-select";
//import DayDate from "@/components/DayDate";
import Pagination from "@/components/Pagination";
import { DeliveryDetails } from "@/components/Overlays/DeliveryDetails";
import FormInput from "@/components/FormInput";
import { RideOrderCard } from "@/app/shared";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function MyOrdersPage() {
  type Package = {
    id: number;
    created_at: string;
    to_location: string;
    delivery_id: string;
    price: string;
    status: string;
  };
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [riderId, setRiderId] = useState<string | null>(null);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false);

  useEffect(() => {
    const id = sessionStorage.getItem("rider_id");
    if (id) {
      setRiderId(id);
    }
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      if (!riderId) return;

      const query = new URLSearchParams({
        search,
        filter,
        rider_id: riderId,
      }).toString();

      try {
        const res = await fetch(`https://api.kaya.ng/kaya-api/rider/get-orders.php?${query}`);
        const data = await res.json();
        if (data.status === "success") {
          setPackages(data.data);
        }
      } catch (error) {
        console.error("Fetch failed", error);
      }
    };

    fetchPackages();
  }, [riderId, search, filter]);


  return (
    <div className="w-[90%] mx-auto space-y-3 py-6 relative">
      <Link
        href={"/rider/home"}
        className="text-primary absolute right-4 flex gap-1 text-sm">
        <ChevronLeft />
        Back To Home
      </Link>

      <div>
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <p>Quick access to your latest deliveries! 📦</p>
      </div>
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        {/*
        <DayDate />
        */}
        <div className="flex items-center gap-2">
          <FormInput
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select onValueChange={setFilter}>
            <SelectTrigger className="min-w-16 px-2 outline outline-1 outline-foreground/10 py-2 rounded-md">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7-days">Last 7 days</SelectItem>
              <SelectItem value="30-days">Last 30 days</SelectItem>
              <SelectItem value="3-months">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
      {packages.map((pkg) => (
        <DeliveryDetails
          key={pkg.id}
          onOpenChange={setShowDeliveryDetails}
          open={showDeliveryDetails}>
          <RideOrderCard
            data={{
              id: pkg.id,
              created_at: pkg.created_at,
              to_location: pkg.to_location,
              delivery_id: pkg.delivery_id,
              price: pkg.price,
              status: pkg.status,
            }}
          />
        </DeliveryDetails>
      ))}

      <Pagination currentPage={0} onPageChange={() => {}} />
    </div>
  );
}
