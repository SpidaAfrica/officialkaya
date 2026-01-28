"use client";
export const dynamic = "force-dynamic";

import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/custom-select";
import { Label } from "@/components/ui/label";
import DayDate from "@/components/DayDate";
import Script from "next/script";

// Define type for transaction
type Transaction = {
  id: string;
  date: string;
  title: string;
  reference: string;
  balance: string;
  status: "success" | "pending" | "failed";
  amount: string;
  created_at: string;
  description: string;
  type: "credit" | "debit";
};

// TransactionTile component
const TransactionTile = ({
  id,
  date,
  title,
  reference,
  status,
  amount,
  type,
  description,
  onClick,
}: Transaction & { onClick: () => void }) => {
  const icon = {
    credit: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M5.64608 7.02411L0.130508 1.51048L1.50916 0.130859L7.02473 5.64643L11.85 0.820184V11.8504H0.819833L5.64608 7.02411Z"
          fill="#38C793"
        />
      </svg>
    ),
    debit: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M6.351 4.97469L11.8676 10.4893L10.4879 11.8689L4.97333 6.35334L0.147079 11.1796V0.148438H11.1773L6.351 4.97469Z"
          fill="#DF1C41"
        />
      </svg>
    ),
  };

  const bgColor = {
    credit: "bg-green-100",
    debit: "bg-rose-100",
  };

  const amountColor = {
    credit: "text-green-500",
    debit: "text-rose-500",
  };

  const formattedDate = new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={onClick}
      className="flex justify-between gap-4 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex items-center gap-3 w-full">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${bgColor[type]}`}>
          {icon[type]}
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div className="text-[15px] font-medium text-gray-900">{title}</div>
          <div className="text-xs text-gray-400">{formattedDate}</div>
          <div className="text-xs text-gray-400">Ref: {reference}</div>
        </div>
      </div>
      <div className="text-right flex flex-col items-end justify-center">
        <div className={`font-semibold text-[15px] ${amountColor[type]}`}>
          {type === "credit" ? "+" : "-"}₦{Number(amount).toLocaleString()}
        </div>
        <Badge
          className={`capitalize text-xs px-2 py-0.5 mt-1 ${
            status === "success"
              ? "bg-green-100 text-green-600"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </Badge>
      </div>
    </div>
  );
};

export default function WalletPage() {
  const [hideBalance, setHideBalance] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  
  // Load user data from session storage
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("rider_id");
    const storedEmail = sessionStorage.getItem("email");
  
    setUserId(storedUserId);
    setEmail(storedEmail);
  }, []);

  // Fetch wallet balance
  useEffect(() => {
    if (!userId) return;
    
    fetch(`https://api.kaya.ng/kaya-api/rider/get-wallet.php?rider_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.balance) {
          setBalance(Number(data.balance));
        } else if (data && typeof data === 'object') {
          // Try to find balance in the response
          const possibleBalance = Object.values(data).find(val => 
            !isNaN(Number(val)) || (typeof val === 'string' && !isNaN(Number(val)))
          );
          if (possibleBalance) {
            setBalance(Number(possibleBalance));
          }
        }
      })
      .catch(err => console.error("Error fetching wallet balance:", err));
  }, [userId]);
  
  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      
      const query = new URLSearchParams({
        user_id: userId,
        page: page.toString(),
        ...(typeFilter && { type: typeFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search }),
      });

      try {
        const res = await fetch(`https://api.kaya.ng/kaya-api/rider/rider-transactions.php?${query.toString()}`);
        const data = await res.json();
        
        if (data && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
          
          // Get pagination info
          if (data.pagination && typeof data.pagination === 'object') {
            setTotalPages(data.pagination.totalPages || 1);
          } else {
            setTotalPages(1);
          }
        } else {
          console.warn("Unexpected API response format:", data);
          setTransactions([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTransactions();
  }, [typeFilter, statusFilter, search, page, userId]);

  // Toggle balance visibility
  const toggleBalanceVisibility = useCallback(() => {
    setHideBalance(prev => !prev);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Wallet Balance Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Wallet Balance</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBalanceVisibility}
            className="h-8 w-8"
          >
            {hideBalance ? <EyeClosed size={18} /> : <Eye size={18} />}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl font-bold">
            ₦{hideBalance ? "****" : balance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-xl">Recent Transactions</p>
        </div>
        
        <p className="text-foreground/60">
          Quick access to your latest transactions. Check the status or view details.
        </p>

        {/* Filters */}
          <div className="w-[90%] mx-auto">
            <div className="flex flex-col justify-between md:flex-row md:items-center gap-2">
              <DayDate />
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="search"
                  className="text-foreground rounded-md bg-background border border-foreground/20 px-2 !py-2 h-auto min-w-60 outline outline-1 outline-foreground/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex gap-3 items-center border-b py-[6px] rounded-md px-2 border">
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5 9.5H8.5V8H5.5V9.5ZM0.25 0.5V2H13.75V0.5H0.25ZM2.5 5.75H11.5V4.25H2.5V5.75Z"
                        fill="#525866"
                      />
                    </svg>
                    <span className="text-sm text-foreground/70">Filter</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 right-0 p-2">
                    <header className="p-2">Filter Options</header>
                    <div className="p-2 space-y-3 border-t border-b">
                      <div>
                        <Label className="text-xs">Transfer Type</Label>
                        <Select onValueChange={setTypeFilter}>
                          <SelectTrigger className="p-2 rounded !outline outline-1 outline-foreground/10">
                            <SelectValue placeholder="select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit">Credit</SelectItem>
                            <SelectItem value="debit">Debit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Transaction Status</Label>
                        <Select onValueChange={setStatusFilter}>
                          <SelectTrigger className="p-2 rounded !outline outline-1 outline-foreground/10">
                            <SelectValue placeholder="select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

        {/* Transactions List */}
        <div className="space-y-2 divide-y">
          {loading ? (
            <div className="py-8 text-center">Loading transactions...</div>
          ) : transactions.length > 0 ? (
            transactions.map((txn) => (
              <TransactionTile
                key={txn.id}
                id={txn.id}
                date={txn.created_at}
                title={txn.description}
                reference={txn.reference}
                status={txn.status.toLowerCase() as "success" | "pending" | "failed"}
                amount={txn.amount}
                type={txn.type as "credit" | "debit"}
                balance={txn.balance}
                description={txn.description}
                created_at={txn.created_at}
                onClick={() => console.log("Transaction:", txn.id)}
              />
            ))
          ) : (
            <div className="py-8 text-center">No transactions found.</div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
