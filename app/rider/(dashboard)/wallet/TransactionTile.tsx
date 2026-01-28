"use client";
export const dynamic = "force-dynamic";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import React from "react";

type Props = {
  id: number;
  date: string;
  title: string;
  referenceId: string;
  balance: string;
  status: "successful" | "pending" | "failed";
  amount: string;
  type: "deposit" | "transfer" | "withdrawal";
  onClick?(): void;
};

export default function TransactionTile(transaction: Props) {
  // Icon & color logic
  const icon = {
    deposit: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M5.64608 7.02411L0.130508 1.51048L1.50916 0.130859L7.02473 5.64643L11.85 0.820184V11.8504H0.819833L5.64608 7.02411Z"
          fill="#38C793"
        />
      </svg>
    ),
    transfer: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M6.351 4.97469L11.8676 10.4893L10.4879 11.8689L4.97333 6.35334L0.147079 11.1796V0.148438H11.1773L6.351 4.97469Z"
          fill="#DF1C41"
        />
      </svg>
    ),
    withdrawal: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V9L13 2Z"
          fill="#F97316"
        />
      </svg>
    ),
  }[transaction.type];

  const bgColor = {
    deposit: "bg-green-100",
    transfer: "bg-rose-100",
    withdrawal: "bg-orange-100",
  }[transaction.type];

  const amountColor = {
    deposit: "text-green-500",
    transfer: "text-rose-500",
    withdrawal: "text-orange-500",
  }[transaction.type];

  const statusBadge = {
    successful: {
      text: "text-green-400",
      bg: "bg-green-100",
      label: "Successful",
    },
    pending: {
      text: "text-yellow-500",
      bg: "bg-yellow-100",
      label: "Pending",
    },
    failed: {
      text: "text-red-500",
      bg: "bg-red-100",
      label: "Failed",
    },
  }[transaction.status.toLowerCase()];

  return (
    <div
      onClick={() => transaction.onClick?.()}
      className="flex gap-2 md:gap-4 py-4 cursor-pointer"
    >
      <div
        className={cn(
          "w-12 h-12 shrink-0 rounded-sm flex items-center justify-center",
          bgColor
        )}
      >
        {icon}
      </div>

      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex flex-col items-start lg:flex-row lg:items-center gap-1 lg:gap-3">
            <p className="text-xl font-medium">{transaction.title}</p>
              {statusBadge && (
                <div
                  className={cn(
                    "flex items-center gap-2 rounded px-2 py-0.5",
                    statusBadge.bg,
                    statusBadge.text
                  )}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12C2.6862 12 0 9.3138 0 6C0 2.6862 2.6862 0 6 0C9.3138 0 12 2.6862 12 6C12 9.3138 9.3138 12 6 12ZM5.4018 8.4L9.6438 4.1574L8.7954 3.309L5.4018 6.7032L3.7044 5.0058L2.856 5.8542L5.4018 8.4Z"
                      fill="currentColor"
                    />
                  </svg>
                  <small>{statusBadge.label}</small>
                </div>
              )}
            {/*
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12C2.6862 12 0 9.3138 0 6C0 2.6862 2.6862 0 6 0C9.3138 0 12 2.6862 12 6C12 9.3138 9.3138 12 6 12ZM5.4018 8.4L9.6438 4.1574L8.7954 3.309L5.4018 6.7032L3.7044 5.0058L2.856 5.8542L5.4018 8.4Z"
                  fill="currentColor"
                />
              </svg>
              <small>{statusBadge.label}</small>
            </div>
            */}
          </div>

          <div className="flex items-center gap-2">
            <p className={cn("text-xl font-medium", amountColor)}>
              NGN{parseFloat(transaction.amount).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-medium text-lg">Balance: {transaction.balance}</p>
          <p className="text-sm">Reference: {transaction.referenceId}</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <p className="text-foreground/60 text-xs">{transaction.date}</p>
        </div>
      </div>

      <ChevronRight className="hidden lg:block" />
    </div>
  );
}


/*"use client";
export const dynamic = "force-dynamic";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import React from "react";

type Props = {
  id: number;
  date: string;
  title: string;
  referenceId: string;
  balance: string;
  status: string;
  amount: string;
  type: "deposit" | "withdrawal";
  onClick?(): void;
};

export default function TransactionTile(transaction: Props) {
  const isTransfer = transaction.type === "withdrawal";
  const isSuccessful = transaction.status.toLowerCase() === "successful";

  const icon = isTransfer ? (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.351 4.97469L11.8676 10.4893L10.4879 11.8689L4.97333 6.35334L0.147079 11.1796V0.148438H11.1773L6.351 4.97469Z"
        fill="#DF1C41"
      />
    </svg>
  ) : (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.64608 7.02411L0.130508 1.51048L1.50916 0.130859L7.02473 5.64643L11.85 0.820184V11.8504H0.819833L5.64608 7.02411Z"
        fill="#38C793"
      />
    </svg>
  );

  return (
    <div
      onClick={() => transaction.onClick?.()}
      key={transaction.id}
      className="flex gap-2 md:gap-4 py-4"
    >
      <div
        className={cn(
          "w-12 h-12 shrink-0 rounded-sm flex items-center justify-center",
          isTransfer ? "bg-rose-100" : "bg-green-100"
        )}
      >
        {icon}
      </div>

      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-col md:items-center md:flex-row justify-between">
          <div className="flex flex-col items-start lg:flex-row lg:items-center gap-1 lg:gap-3">
            <p className="text-xl font-medium">{transaction.title}</p>

            {isSuccessful && (
              <div className="flex items-center gap-2 text-green-400 rounded bg-green-100 px-2">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 12C2.6862 12 0 9.3138 0 6C0 2.6862 2.6862 0 6 0C9.3138 0 12 2.6862 12 6C12 9.3138 9.3138 12 6 12ZM5.4018 8.4L9.6438 4.1574L8.7954 3.309L5.4018 6.7032L3.7044 5.0058L2.856 5.8542L5.4018 8.4Z"
                    fill="#38C793"
                  />
                </svg>
                <small>successful</small>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <p
              className={cn(
                "text-xl font-medium",
                isTransfer ? "text-rose-500" : "text-green-400"
              )}
            >
              NGN{parseFloat(transaction.amount).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-medium text-lg">
            Balance: {transaction.balance}
          </p>
          <p className="text-sm">Reference: {transaction.referenceId}</p>
        </div>

        <div className="flex flex-col md:items-center md:flex-row justify-between">
          <p className="text-foreground/60 text-xs">{transaction.date}</p>
        </div>
      </div>

      <ChevronRight className="hidden lg:block" />
    </div>
  );
}
*/
/*"use client";
export const dynamic = "force-dynamic";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import React from "react";

type Props = {
  id: number;
  date: string;
  title: string;
  referenceId: string;
  balance: string;
  status: string;
  amount: string;
  type: "deposit" | "transfer";
  onClick?(): void;
};

export default function TransactionTile(transaction: Props) {
  return (
    <div
      onClick={() => transaction.onClick?.()}
      key={transaction.id}
      className="flex gap-2 md:gap-4 py-4">
      <div
        className={cn(
          "w-12 h-12 shrink-0 rounded-sm flex items-center justify-center",
          transaction.type === "transfer" ? "bg-rose-100" : "bg-green-100"
        )}>
        {transaction.type === "transfer" ? (
          // <ArrowUp className="text-rose-500" />
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.351 4.97469L11.8676 10.4893L10.4879 11.8689L4.97333 6.35334L0.147079 11.1796V0.148438H11.1773L6.351 4.97469Z"
              fill="#DF1C41"
            />
          </svg>
        ) : (
          // <ArrowDown className="text-green-500" />
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.64608 7.02411L0.130508 1.51048L1.50916 0.130859L7.02473 5.64643L11.85 0.820184V11.8504H0.819833L5.64608 7.02411Z"
              fill="#38C793"
            />
          </svg>
        )}
      </div>
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-col md:items-center md:flex-row justify-between">
          <div className="flex flex-col items-start lg:flex-row lg:items-center gap-1 lg:gap-3">
            <p className="text-xl font-medium">{transaction.title}</p>
            <div className="flex items-center gap-2 text-green-400 rounded bg-green-100 px-2 ">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 12C2.6862 12 0 9.3138 0 6C0 2.6862 2.6862 0 6 0C9.3138 0 12 2.6862 12 6C12 9.3138 9.3138 12 6 12ZM5.4018 8.4L9.6438 4.1574L8.7954 3.309L5.4018 6.7032L3.7044 5.0058L2.856 5.8542L5.4018 8.4Z"
                  fill="#38C793"
                />
              </svg>
              <small>successful</small>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xl font-medium text-green-400">
              NGN{parseFloat(transaction.amount).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium text-lg">Balance: {transaction.balance}</p>
          <p className="text-sm">Reference: {transaction.referenceId}</p>
        </div>
        <div className="flex flex-col md:items-center md:flex-row justify-between">
          <p className="text-foreground/60 text-xs">{transaction.date}</p>
        </div>
      </div>
      <ChevronRight className="hidden lg:block" />
    </div>
  );
}
*/
