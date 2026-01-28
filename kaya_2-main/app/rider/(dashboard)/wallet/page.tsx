"use client";
export const dynamic = "force-dynamic";

import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeClosed, Plus, X, Building2, CreditCard, User, User2} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { MainContent } from "@/app/layouts/app-layout";
import Script from "next/script";
import { CardChip, WalletBanner } from "@/assets";
import FormInput from "@/components/FormInput";
import SuccessModal from "@/components/Overlays/SuccessModal";
import { ClogIcon, KeyboardIcon, LockIcon } from "@/lib/icons";
import WithdrawFunds from "./WithdrawFunds";

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
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  
  // Load user data from session storage
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("rider_id");
    const storedEmail = sessionStorage.getItem("email");
  
    setUserId(storedUserId);
    setEmail(storedEmail);
  }, []);

  const openDialog = useCallback(() => setShowPaymentMethods(true), []);
  const toggleDialog = () => setShowPaymentMethods((prev) => !prev);

  const [balance, setBalance] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

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

  // Handle payment process
  /*
  const handlePay = () => {
    if (!userId) {
      alert("User ID is required");
      return;
    }
  
    const paystack = (window as any).PaystackPop;
    if (!paystack) {
      alert("Paystack is not available yet. Please try again.");
      return;
    }
    
    const reference = `TXN-${userId}-${Date.now()}`;
  
    const handler = paystack.setup({
      key: "pk_test_8dbc024aefd873d13976ab80aa449c8aa6134e1d",
      amount: Number(amount) * 100,
      email: email,
      callback: function (response: any) {
        fetch("https://api.kaya.ng/kaya-api/update-wallet.php", {
          method: "POST",
          body: new URLSearchParams({
            user_id: userId || "",
            amount: amount,
            reference: reference,
            description: "Wallet Top Up",
            type: "credit",
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert("Wallet updated!");
              setShowModal(false);
              setBalance((prev) => prev + Number(amount));
              setAmount("");
            } else {
              alert(data.message || "Error updating wallet.");
            }
          })
          .catch(() => {
            alert("Failed to update wallet on the server.");
          });
      },
      onClose: function () {
        alert("Payment cancelled.");
      },
    });
  
    handler.openIframe();
  };
  */
  
  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      
      const query = new URLSearchParams({
        user_id: userId,
        page: page.toString(),
        type: typeFilter,
        status: statusFilter,
        search,
      });

      try {
        const res = await fetch(`https://api.kaya.ng/kaya-api/rider/rider-transactions.php?${query.toString()}`);
        const data = await res.json();
        
        // Match the exact API structure as provided
        if (data && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
          
          // Get pagination info
          if (data.pagination && typeof data.pagination === 'object') {
            setTotalPages(data.pagination.totalPages || 1);
            // Optionally set the current page if needed
            // setPage(data.pagination.currentPage);
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



  return (
    <>
      <MainContent>
        <div className="md:w-[95%] mx-auto space-y-5">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl overflow-hidden mx-3 my-1 h-44 shadow-xl">
            {/* Background Image */}
            <Image
              src={WalletBanner}
              alt="banner"
              className="absolute inset-0 z-0 w-full h-full object-cover"
            />
          
            {/* Card Content */}
            <div className="relative z-10 w-full h-full px-6 py-3 flex flex-col justify-between">
              
              {/* Top Row */}
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold tracking-wide">Wallet Balance</div>
                <Image src={CardChip} alt="card-chip" />
              </div>
          
              {/* Balance Row */}
              <div className="flex flex-row items-center justify-start">
                <p className="text-xl font-bold mt-1">
                  {hideBalance ? "****" : `₦${balance.toLocaleString()}`}
                </p>
                <button
                  onClick={() => setHideBalance(!hideBalance)}
                  className="mt-1 ml-4 text-white text-sm"
                >
                  {hideBalance ? <EyeClosed /> : <Eye />}
                </button>
              </div>
          
              {/* Bottom Row (Withdraw Button) */}
              <div className="flex justify-start items-center">
                <Button
                  onClick={() => setShowWithdrawModal(true)}
                  variant="ghost"
                  className="w-fit min-w-[6rem] px-2 py-1 text-xs bg-white/90 text-gray-800 backdrop-blur-sm"
                >
                  <svg
                    width="6"
                    height="6"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.08151 4.6316L10.7494 9.2978L9.58198 10.4652L4.91578 5.79815L0.832031 9.8819V0.547852H10.1653L6.08151 4.6316Z"
                      fill="#1E2023"
                    />
                  </svg>
                  <span className="ml-1">Withdraw</span>
                </Button>

                {showWithdrawModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
                      <WithdrawFunds onClose={() => setShowWithdrawModal(false)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions Header */}
          <div className="w-[90%] mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-xl">Recent Transactions</p>
              <Link href="wallet/transactions" className="text-primary">
                View All
              </Link>
            </div>
            <p className="text-foreground/60">
              Quick access to your latest transactions. Check the status or view
              details.
            </p>
          </div>

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

          {/* Transactions */}
          <div className="w-[90%] mx-auto space-y-3 divide-y">
            {loading ? (
              <p>Loading transactions...</p>
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
              <p>No transactions found.</p>
            )}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>

        {/* Payment Method Dialog */}
        <Dialog open={showPaymentMethods} onOpenChange={toggleDialog}>
          <DialogContent className="w-full rounded-xl max-w-[90vw] md:max-w-lg">
            <div className="h-full w-full relative px-6 py-8">
              <button onClick={toggleDialog} className="absolute top-4 right-4">
                <X />
              </button>
              <DialogHeader className="flex flex-row items-center justify-between border-b py-2">
                <DialogTitle className="text-lg font-semibold">
                  Add a New Payment Method
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <button className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="rounded-full bg-emerald-100 p-2">
                    <Building2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-medium">New Bank Account</div>
                    <div className="text-sm text-gray-500">
                      Securely add your bank account for seamless payments and quick refunds.
                    </div>
                  </div>
                </button>

                <button className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="rounded-full bg-emerald-100 p-2">
                    <CreditCard className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-medium">New Credit/Debit Card</div>
                    <div className="text-sm text-gray-500">
                      Save your credit or debit card for fast and secure transactions.
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </MainContent>
    </>
  );
}


const BankDetails = ({
  setActiveStep,
}: {
  setActiveStep: (step: number | null) => void;
}) => {
  return (
    <div className="flex mx-auto lg:w-[558px] w-[90%] flex-col gap-4">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Set up your bank details!🛵</h2>
        <p className="text-foreground/60">
          Your information is safe with us and helps ensure smooth communication
          and operations.
        </p>
      </header>
      <FormInput
        leading={<KeyboardIcon />}
        label="Bank Verification Number (BVN) "
        placeholder="Taiwo@gmail.com"
      />
      <FormInput
        leading={
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0.5 14H15.5V15.5H0.5V14ZM2 8H3.5V13.25H2V8ZM5.75 8H7.25V13.25H5.75V8ZM8.75 8H10.25V13.25H8.75V8ZM12.5 8H14V13.25H12.5V8ZM0.5 4.25L8 0.5L15.5 4.25V7.25H0.5V4.25ZM2 5.177V5.75H14V5.177L8 2.177L2 5.177ZM8 5C7.80109 5 7.61032 4.92098 7.46967 4.78033C7.32902 4.63968 7.25 4.44891 7.25 4.25C7.25 4.05109 7.32902 3.86032 7.46967 3.71967C7.61032 3.57902 7.80109 3.5 8 3.5C8.19891 3.5 8.38968 3.57902 8.53033 3.71967C8.67098 3.86032 8.75 4.05109 8.75 4.25C8.75 4.44891 8.67098 4.63968 8.53033 4.78033C8.38968 4.92098 8.19891 5 8 5Z"
                fill="#868C98"
              />
            </svg>
          </>
        }
        label="Bank Name"
        placeholder="Taiwo@gmail.com"
      />
      <FormInput
        leading={<User2 className="size-5" color="#868C98" />}
        label="Account Number"
        placeholder="Taiwo@gmail.com"
      />
      <div className="w-full flex -mt-2">
        <div className="flex rounded-md items-center gap-2 bg-[hsla(25,90%,96%,1)] py-1 px-2 ml-auto">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 12C2.6862 12 0 9.3138 0 6C0 2.6862 2.6862 0 6 0C9.3138 0 12 2.6862 12 6C12 9.3138 9.3138 12 6 12ZM6.6 6V3H5.4V7.2H9V6H6.6Z"
              fill="#F27B2C"
            />
          </svg>
          <small className="text-[#F27B2C]">Aaron Ramon</small>
        </div>
      </div>
      <Button onClick={() => setActiveStep(2)}>Save and Continue</Button>
      <Button
        variant={"outline"}
        onClick={() => setActiveStep(null)}
        className="mt-4 text-primary">
        Cancel
      </Button>
    </div>
  );
};

const UpdatePin = ({
  setActiveStep,
}: {
  setActiveStep: (step: number | null) => void;
}) => {
  return (
    <div className=" flex mx-auto lg:w-[558px] w-[90%] flex-col gap-4">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Update Pin</h2>
      </header>
      <FormInput
        leading={<LockIcon className="size-5" />}
        label="Enter Old 4-digit Password"
        placeholder="Enter Password"
      />
      <FormInput
        leading={<LockIcon className="size-5" />}
        label="Enter new 4-digit Password"
        placeholder="Enter Password"
      />
      <FormInput
        leading={<LockIcon className="size-5" />}
        label="Re- Enter a new-digit Password"
        placeholder="Enter Password"
      />
      <SuccessModal
        title="Wallet Setup Complete"
        message="Your new bank details has been successfully updated"
        showButton={false}>
        <Button onClick={() => setActiveStep(2)}>Save and Continue</Button>
      </SuccessModal>
      <Button
        variant={"outline"}
        onClick={() => setActiveStep(null)}
        className="mt-4 text-primary">
        Cancel
      </Button>
    </div>
  );
};
/*
function WithdrawFunds({
  setActiveStep,
}: {
  setActiveStep: (step: number | null) => void;
}) {
  return (
    <div className=" flex mx-auto lg:w-[558px] w-[90%] flex-col gap-4">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Withdraw Funds</h2>
        <p className="text-foreground/60">
          Successfully withdraw your funds. You’ve Earned it!!
        </p>
      </header>
      <FormInput
        leading={
          <svg
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.00111 7.50012C8.38179 7.50012 9.50111 6.38081 9.50111 5.00012C9.50111 3.61941 8.38179 2.50012 7.00111 2.50012C5.62037 2.50012 4.50109 3.61941 4.50109 5.00012C4.50109 6.38081 5.62037 7.50012 7.00111 7.50012ZM12.6289 0.00195312H1.37891C1.03373 0.00195312 0.753906 0.281772 0.753906 0.626953V9.37693C0.753906 9.72212 1.03373 10.0019 1.37891 10.0019H12.6289C12.9741 10.0019 13.2539 9.72212 13.2539 9.37693V0.626953C13.2539 0.281772 12.9741 0.00195312 12.6289 0.00195312ZM2.00391 7.27906V2.72119C2.70751 2.51075 3.26233 1.9557 3.47245 1.25195H10.5297C10.7404 1.95758 11.2976 2.51372 12.0039 2.72287V7.27737C11.2964 7.48687 10.7385 8.04456 10.5286 8.75193H3.47354C3.26426 8.0465 2.70874 7.48987 2.00391 7.27906Z"
              fill="#868C98"
            />
          </svg>
        }
        label="Amount To withdraw"
        placeholder="Enter amount to withdraw"
      />

      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#f2f2f2] w-fit">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 5.39961V10.7996C12 10.9587 11.9368 11.1114 11.8243 11.2239C11.7117 11.3364 11.5591 11.3996 11.4 11.3996H0.6C0.44087 11.3996 0.288258 11.3364 0.175736 11.2239C0.0632141 11.1114 0 10.9587 0 10.7996V5.39961H12ZM12 2.99961H0V1.19961C0 1.04048 0.0632141 0.887867 0.175736 0.775345C0.288258 0.662823 0.44087 0.599609 0.6 0.599609H11.4C11.5591 0.599609 11.7117 0.662823 11.8243 0.775345C11.9368 0.887867 12 1.04048 12 1.19961V2.99961Z"
            fill="#475467"
          />
        </svg>
        <span>Current Balance: NGN {"50,000"}</span>
      </div>

      <FormInput
        leading={<User className="size-5" />}
        label="Destination"
        placeholder="Meji Austin Peters"
      />
      <FormInput
        leading={<LockIcon className="size-5" />}
        label="Wallet Pin"
        type="Password"
        placeholder="4-digit wallet pin"
      />
      <div className="flex md:flex-col items-center gap-3 mt-3">
        <SuccessModal
          title="Withdrawal Successful! 💸"
          message="Your withdrawal has been processed. Check your account shortly!"
          showButton={false}>
          <Button>Save and Continue</Button>
        </SuccessModal>
        <Button
          variant={"outline"}
          onClick={() => setActiveStep(null)}
          className="text-primary">
          Cancel
        </Button>
      </div>
    </div>
  );
}
*/
