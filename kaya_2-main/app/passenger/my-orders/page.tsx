"use client";
export const dynamic = "force-dynamic";

import React, { Fragment, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/custom-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import FormInput from "@/components/FormInput";
import Pagination from "@/components/Pagination";
import { DeliveryDetails } from "@/components/Overlays/DeliveryDetails";
import { OrderCard } from "@/app/shared";
import Image from "next/image";
import Link from "next/link";
import NoOrders from "@/assets/no-orders.svg";
import { ChevronLeft } from "lucide-react";

type Package = {
  id: number;
  created_at: string;
  to_location: string;
  delivery_id: string;
  price: string;
  status: string;
};

interface ApiResponse {
  data?: Package[];
  total_pages?: number;
}

export default function MyOrdersPage() {
  const [hasOrders, setHasOrders] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [packageType, setPackageType] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const storedId = sessionStorage.getItem("userId");
    if (storedId) setUserId(storedId);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHasOrders(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchPackages = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          search,
          status,
          ride_rating: rating,
          package_category: packageType,
          date_filter: dateFilter,
          page: page.toString(),
          user_id: userId,
        });

        const res = await fetch(`https://api.kaya.ng/kaya-api/filter-packages.php?${params}`);
        const data: ApiResponse = await res.json();

        setPackages(data?.data ?? []);
        setTotalPages(data?.total_pages ?? 1);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setPackages([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [userId, search, status, rating, packageType, dateFilter, page]);

  const clearFilters = () => {
    setStatus("");
    setRating("");
    setPackageType("");
  };

  if (!hasOrders) {
    return (
      <div className="w-full h-[80dvh] flex flex-col items-center justify-center gap-4">
        <Image src={NoOrders} alt="no orders" />
        <div className="text-sm text-center">
          <p>No orders yet</p>
          <p>Start exploring and ordering now!</p>
        </div>
        <Button asChild>
          <Link href="/passenger/home">Go Back Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto space-y-3 py-6 relative">
      <Link href="/passenger/home" className="text-primary absolute right-4 flex gap-1 text-sm">
        <ChevronLeft />
        Back To Home
      </Link>

      <header>
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <p>Quick access to your latest deliveries! 📦 Check the status or view details.</p>
      </header>

      <div className="flex flex-col justify-between md:flex-row md:items-center gap-2">
        <div className="flex items-center">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="rounded-r-none min-w-16 px-2 py-1 rounded-l-md outline outline-1 outline-foreground/10">
              <SelectValue placeholder="Pick range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7-days">Last 7 days</SelectItem>
              <SelectItem value="30-days">Last 30 days</SelectItem>
              <SelectItem value="3-months">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          <DatePicker />
        </div>

        <div className="flex items-center gap-2">
          <FormInput
            type="text"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-foreground rounded-md bg-background min-w-60 border-none outline-none"
            leading={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M7.25 0.5C10.976 0.5 14 3.524 14 7.25C14 10.976 10.976 14 7.25 14C3.524 14 0.5 10.976 0.5 7.25C0.5 3.524 3.524 0.5 7.25 0.5ZM7.25 12.5C10.1502 12.5 12.5 10.1502 12.5 7.25C12.5 4.349 10.1502 2 7.25 2C4.349 2 2 4.349 2 7.25C2 10.1502 4.349 12.5 7.25 12.5ZM13.6137 12.5532L15.7355 14.6742L14.6742 15.7355L12.5532 13.6137L13.6137 12.5532Z"
                  fill="#868C98"
                />
              </svg>
            }
            wrapperClassName={() =>
              "outline !ring-foreground/10 outline-foreground/10 border-foreground/10"
            }
          />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-3 items-center border-b py-[6px] rounded-md px-2 border">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path
                  d="M5.5 9.5H8.5V8H5.5V9.5ZM0.25 0.5V2H13.75V0.5H0.25ZM2.5 5.75H11.5V4.25H2.5V5.75Z"
                  fill="#525866"
                />
              </svg>
              <span className="text-sm text-foreground/70">Filter</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 right-0 p-2">
              <header className="p-2">Filter Options</header>
              <div className="p-2 space-y-3 border-t">
                <FilterSelect label="Order Status" value={status} onChange={setStatus} options={["pending", "completed", "cancelled"]} />
                <FilterSelect label="Rider Rating" value={rating} onChange={setRating} options={["5", "4", "3", "2", "1"]} />
                <FilterSelect label="Package Type" value={packageType} onChange={setPackageType} options={["Small", "Medium", "Large"]} />
                <div className="flex items-center gap-3 border-t pt-3">
                  <Button variant="outline" onClick={clearFilters}>Cancel</Button>
                  <Button>Apply</Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-2 w-[90%] md:w-full mx-auto divide-y divide-gray-50/20">
        {loading ? (
          <div className="text-center py-10">Loading orders...</div>
        ) : packages.length ? (
          packages.map((pack) => (
            <Fragment key={pack.id}>
              <DeliveryDetails>
                <OrderCard data={pack} />
              </DeliveryDetails>
            </Fragment>
          ))
        ) : (
          <div className="text-center py-10">No results found.</div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

// ✅ Reusable & Safe Filter Select
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-muted-foreground">{label}</label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
