"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LockIcon, User } from "lucide-react";
import SuccessModal from "@/components/Overlays/SuccessModal";
import FormInput from "@/components/FormInput";

export default function WithdrawFunds({ onClose }: { onClose: () => void }) {
  const [riderId, setRiderId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState(""); // bank_name
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState(""); // Could be a dropdown if needed
  const [walletPin, setWalletPin] = useState(""); // For future security
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("rider_id");
    setRiderId(storedUserId);
  }, []);

  const handleWithdraw = async () => {
    setLoading(true);
    if (!riderId) return;

    try {
      const response = await fetch(
        "https://www.kaya.ng/kaya-api/rider/request-withdrawal.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rider_id: riderId,
            amount,
            bank_code: bankCode,
            account_number: accountNumber,
            bank_name: accountName,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        alert(data.message || "Withdrawal failed.");
      }
    } catch (error) {
      alert("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-xl text-foreground">
      <header className="space-y-1 mb-6">
        <h2 className="text-2xl font-semibold">Withdraw Funds</h2>
        <p className="text-sm text-muted-foreground">
          Successfully withdraw your funds. You’ve earned it!
        </p>
      </header>

      <FormInput
        label="Amount To Withdraw"
        placeholder="Enter amount to withdraw"
        value={amount}
        onChange={(e: any) => setAmount(e.target.value)}
      />

      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#f2f2f2] w-full md:w-fit text-sm mt-1">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5.39961V10.7996C12 10.9587 11.9368 11.1114 11.8243 11.2239C11.7117 11.3364 11.5591 11.3996 11.4 11.3996H0.6C0.44087 11.3996 0.288258 11.3364 0.175736 11.2239C0.0632141 11.1114 0 10.9587 0 10.7996V5.39961H12ZM12 2.99961H0V1.19961C0 1.04048 0.0632141 0.887867 0.175736 0.775345C0.288258 0.662823 0.44087 0.599609 0.6 0.599609H11.4C11.5591 0.599609 11.7117 0.662823 11.8243 0.775345C11.9368 0.887867 12 1.04048 12 1.19961V2.99961Z"
            fill="#475467"
          />
        </svg>

      </div>

      <FormInput
        leading={<User className="size-5" />}
        label="Account Name"
        placeholder="e.g., Meji Austin Peters"
        value={accountName}
        onChange={(e: any) => setAccountName(e.target.value)}
      />

      <FormInput
        leading={<User className="size-5" />}
        label="Account Number"
        placeholder="e.g., 0123456789"
        value={accountNumber}
        onChange={(e: any) => setAccountNumber(e.target.value)}
      />

      <FormInput
        leading={<User className="size-5" />}
        label="Bank Code"
        placeholder="e.g., 058 for GTBank"
        value={bankCode}
        onChange={(e: any) => setBankCode(e.target.value)}
      />

      <FormInput
        leading={<LockIcon className="size-5" />}
        label="Wallet Pin"
        type="password"
        placeholder="4-digit wallet pin"
        value={walletPin}
        onChange={(e: any) => setWalletPin(e.target.value)}
      />

      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <SuccessModal
          title="Withdrawal Successful! 💸"
          message="Your withdrawal has been processed. Check your account shortly!"
          showButton={false}
          isOpen={success}
          onClose={setSuccess}
        >
          <Button onClick={handleWithdraw} disabled={loading} className="w-full">
            {loading ? 'Processing...' : 'Withdraw'}
          </Button>
        </SuccessModal>

        <Button variant="outline" onClick={onClose} className="w-full text-primary">
          Cancel
        </Button>
      </div>
    </div>
    </>
  );
}
