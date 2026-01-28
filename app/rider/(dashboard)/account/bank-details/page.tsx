"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import success from "@/assets/document.svg";
import { Home, Keyboard, Phone } from "lucide-react";
import { VerificationPage } from "../../components/verificationComp";
import { AltInput } from "../../components/Alt";
import { Lock } from "@/components/svgs";
import SuccessModal from "@/components/Overlays/SuccessModal";

export default function BankDetails() {
  return (
    <div className="py-12">
      <MainPage />
    </div>
  );
}

const MainPage = () => {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  if (onboardingCompleted) {
    return <VerificationPage />;
  }
  return (
    <>
      {activeStep === null ? (
        <div className="space-y-3 max-w-md mx-auto">
          <Button
            onClick={() => setActiveStep(1)}
            className="w-full"
            variant={"ghost"}>
            <span className="flex flex-1 items-center gap-2">
              <span className="p-2 text-sm bg-primary w-7 h-7 rounded-full text-background/80 flex items-center justify-center">
                1
              </span>
              <span>Bank Account Setup</span>
            </span>
            <span>
              <ChevronRight />
            </span>
          </Button>

          <Button
            onClick={() => setActiveStep(2)}
            className="w-full"
            variant={"ghost"}>
            <span className="flex flex-1 items-center gap-2">
              <span className="p-2 text-sm bg-primary w-7 h-7 rounded-full text-background/80 flex items-center justify-center">
                2
              </span>
              <span>Withdrawal Pin Setup</span>
            </span>
            <span>
              <ChevronRight />
            </span>
          </Button>
        </div>
      ) : activeStep === 1 ? (
        <PersonalInfo setActiveStep={setActiveStep} />
      ) : activeStep === 2 ? (
        <VehicleInfo setActiveStep={setActiveStep} />
      ) : activeStep === 3 ? (
        <GuarantorInfo setActiveStep={setActiveStep} />
      ) : activeStep === 4 ? (
        <SuccessForm setOnboardingCompleted={setOnboardingCompleted} />
      ) : null}
    </>
  );
};

const PersonalInfo = ({
  setActiveStep,
}: {
  setActiveStep: (step: number | null) => void;
}) => {
  const [bvn, setBvn] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleSubmit = async () => {
    const rider_id = sessionStorage.getItem("rider_id");
    if (!rider_id) return alert("Rider not found");

    const formData = new FormData();
    formData.append("rider_id", rider_id);
    formData.append("bvn", bvn);
    formData.append("bank_name", bankName);
    formData.append("account_number", accountNumber);

    const res = await fetch("https://api.kaya.ng/kaya-api/rider/bank-details.php", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      alert("Saved successfully");
      setActiveStep(2); // Or next step
    } else {
      alert(data.message);
    }
  };
  return (
    <div className=" flex mx-auto lg:w-[558px] w-[90%] flex-col ">
      <AltInput
        icon={<Keyboard className="size-5" color="#868C98" />}
        label="Bank Verification Number (BVN) "
        placeholder="BVN"
        value={bvn}
        onChange={(e) => setBvn(e.target.value)}
      />
      <AltInput
        icon={
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
        placeholder="Bank Name"
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
      />
      <AltInput
        icon={<User className="size-5" color="#868C98" />}
        label="Account Number"
        placeholder="Account Number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />
      <div className="w-full flex -mt-2 mb-4">
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
          {/*<small className="text-[#F27B2C]">Aaron Ramon</small>*/}
        </div>
      </div>
      <Button onClick={handleSubmit}>Save and Continue</Button>
      <Button
        variant={"outline"}
        onClick={() => setActiveStep(null)}
        className="mt-4 text-primary">
        Cancel
      </Button>
    </div>
  );
};
const VehicleInfo = ({
  setActiveStep,
}: {
  setActiveStep: (step: number | null) => void;
}) => {
  return (
    <div className=" flex mx-auto lg:w-[558px] w-[90%] flex-col ">
      <AltInput
        icon={<Lock className="size-5" />}
        label="Enter Old 4-digit Password"
        placeholder="Enter Password"
      />
      <AltInput
        icon={<Lock className="size-5" />}
        label="Enter new 4-digit Password"
        placeholder="Enter Password"
      />
      <AltInput
        icon={<Lock className="size-5" />}
        label="Re- Enter a new-digit Password"
        placeholder="Enter Password"
      />
      <SuccessModal
        title="Details Updated Successfully"
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
const GuarantorInfo = ({
  setActiveStep,
}: {
  setActiveStep: (step: number | null) => void;
}) => {
  return (
    <div className=" flex  mx-auto lg:w-[558px] w-full flex-col ">
      <div className=" rounded-[999px] border mb-3 border-[#00ABFD] text-primary font-medium leading-4  tracking-[2%] w-fit px-2 py-[6px] bg-white flex items-center justify-center">
        <span className=" uppercase text-[12px] "> Step 3 of 3</span>
      </div>

      <p className=" text-[32px] font-semibold leading-[38px] mb-3 tracking-[-6%] text-[#475467]">
        Add a Guarantor for Extra Assurance
      </p>
      <p className=" text-[18px] font-normal mb-5 leading-[24px] tracking-[-6%] text-[#8A8A8C]">
        Your guarantor’s information will remain confidential and will only be
        used for verFification purposes.
      </p>

      <AltInput
        icon={<User className="size-5" color="#868C98" />}
        label="Guarantor’s Full Name"
        placeholder="Taiwo@gmail.com"
      />
      <AltInput
        icon={<Phone className="size-5" color="#868C98" />}
        label="Guarantor’s Phone Number"
        placeholder="Taiwo@gmail.com"
      />
      <AltInput
        icon={<Home className="size-5" color="#868C98" />}
        label="Guarantor’s Home Address"
        placeholder="Taiwo@gmail.com"
      />
      <Button onClick={() => setActiveStep(4)}>Save and Continue</Button>
      <Button
        onClick={() => setActiveStep(null)}
        className="bg-white text-primary mt-5 border-[#00ABFD] border-[0.73px]">
        Cancel
      </Button>
    </div>
  );
};

const SuccessForm = ({
  setOnboardingCompleted,
}: {
  setOnboardingCompleted: (completed: boolean) => void;
}) => {
  return (
    <div className=" flex mx-auto lg:w-[558px] justify-center items-center w-full flex-col ">
      <Image
        src={success}
        width={275}
        height={254}
        className=" mb-[35px]"
        alt="success"
      />
      <p className=" lg:text-[34px] text-[18px] leading-[21px]  font-semibold lg:leading-[38px] mb-4 tracking-[-6%] text-[#0A0D14]">
        Documents Submitted for Review
      </p>
      <p className=" lg:text-[16px] text-[14px] text-center mb-[56px] max-w-[552px] font-normal leading-[21px] tracking-[-4%] text-[#8A8A8C]">
        Thank you for completing your setup! Our team is reviewing your
        documents to ensure everything is in order. Once verified, you’ll be
        ready to start accepting delivery orders and earning with Apago
      </p>
      <button
        className=" text-[#00ABFD]  text-[16px] font-semibold leading-[20px] tracking-[-4%]"
        onClick={() => setOnboardingCompleted(true)}>
        Go to Dashboard
      </button>
    </div>
  );
};
