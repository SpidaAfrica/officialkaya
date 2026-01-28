"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { User, Home, Phone, Keyboard, ChevronDown } from "lucide-react";
import Image from "next/image";
import axios from "axios";

import success from "@/assets/success.svg";
import bike from "@/assets/bike.svg";
import empty from "@/assets/empty.svg";

import { Button } from "@/components/ui/button";

// === SHARED COMPONENTS ===
type StepProps = {
  setActiveStep: (step: number | null) => void;
};

const StepHeader = ({ step }: { step: number }) => (
  <div className="rounded-full border mb-3 border-[#00ABFD] text-primary font-medium leading-4 tracking-[2%] w-fit px-2 py-[6px] flex items-center justify-center">
    <span className="uppercase text-[12px]">Step {step} of 3</span>
  </div>
);

const StepTitle = ({ title }: { title: string }) => (
  <>
    <p className="text-[32px] font-semibold leading-[38px] mb-3 tracking-[-6%] text-[#475467]">{title}</p>
    <p className="text-[18px] font-normal leading-[24px] tracking-[-6%] text-[#8A8A8C] mb-5">
      Your information is safe with us and helps ensure smooth communication and operations.
    </p>
  </>
);

const UploadBlock = ({ label, inputId = "upload" }: { label: string; inputId?: string }) => (
  <div className="flex gap-5 mt-5 mb-6">
    <Image src={empty} width={64} height={64} alt="upload-icon" />
    <div className="flex flex-col gap-3">
      <p className="text-[16px] font-medium leading-6 tracking-[-6%] text-[#1E2023]">{label}</p>
      <label
        htmlFor={inputId}
        className="text-[14px] w-fit px-[10px] shadow-md py-[6px] border border-[#E2E4E9] rounded-[8px] font-medium leading-5 tracking-[2%] text-[#525866] cursor-pointer"
      >
        Upload
      </label>
      <input type="file" id={inputId} className="hidden" />
    </div>
  </div>
);

const FormInput = ({
  name,
  control,
  label,
  placeholder,
  icon,
}: {
  name: string;
  control: any;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
}) => (
  <fieldset className="flex mb-5 flex-col">
    <label className="text-[14px] mb-1 font-normal leading-5 tracking-[2%] text-[#0A0D14]" htmlFor={name}>
      {label}
    </label>
    <div className="relative flex items-center">
      {icon && <div className="absolute left-3">{icon}</div>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            placeholder={placeholder}
            className="border w-full h-10 pl-10 pr-3 rounded-[4px] border-[#E2E4E9]"
          />
        )}
      />
    </div>
  </fieldset>
);

const FormSelect = ({
  name,
  control,
  label,
  icon,
  options,
}: {
  name: string;
  control: any;
  label: string;
  icon?: React.ReactNode;
  options: string[];
}) => (
  <fieldset className="flex mb-5 flex-col">
    <label className="text-[14px] mb-1 font-normal leading-5 tracking-[2%] text-[#0A0D14]">{label}</label>
    <div className="relative flex items-center">
      {icon && <div className="absolute left-3">{icon}</div>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className="w-full h-10 border rounded-[4px] pl-10 pr-8 border-[#E2E4E9] appearance-none"
          >
            {options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      />
      <ChevronDown className="absolute right-3" />
    </div>
  </fieldset>
);

// === STEP FORMS ===

export const PersonalInfo: React.FC<StepProps> = ({ setActiveStep }) => {
  const { handleSubmit, control } = useForm();
  const [ninFile, setNinFile] = useState<File | null>(null);
  const [riderId, setRiderId] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("rider_id");
    if (id) setRiderId(id);
  }, []);


  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("rider_id", riderId || "");
      formData.append("nin", data.nin);
      formData.append("address", data.address);
      if (ninFile) formData.append("nin_certificate", ninFile);

      const response = await fetch("https://api.kaya.ng/kaya-api/rider/save-personal-info.php", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit personal info");

      setActiveStep(2);
    } catch (err) {
      console.error("Personal Info Error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex mx-auto lg:w-[558px] w-full flex-col"
      encType="multipart/form-data"
    >
      <StepHeader step={1} />
      <StepTitle title="Tell Us More About Yourself! 👤" />

      <div className="flex gap-5 mt-5 mb-6">
        <div className="flex flex-col gap-3">
          <p className="text-[16px] font-medium leading-6 tracking-[-6%] text-[#1E2023]">
            Upload Image of your NIN certificate
          </p>
          <label
            htmlFor="nin-upload"
            className="text-[14px] w-fit px-[10px] shadow-sm py-[6px] border border-[#E2E4E9] rounded-[8px] font-medium leading-5 tracking-[2%] text-[#525866] cursor-pointer"
          >
            {ninFile ? ninFile.name : "Choose File"}
          </label>
          <input
            id="nin-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) setNinFile(e.target.files[0]);
            }}
          />
        </div>
      </div>

      <FormInput name="nin" control={control} icon={<User className="size-5 text-gray-500" />} label="Your NIN number" placeholder="1234..." />
      <FormInput name="address" control={control} icon={<Home className="size-5 text-gray-500" />} label="Home Address" placeholder="4 Bankole str..." />

      <Button type="submit">Save and Continue</Button>
      <Button type="button" onClick={() => setActiveStep(null)} variant="outline" className="mt-5 text-primary border-[0.73px]">
        Cancel
      </Button>
    </form>
  );
};

export const VehicleInfo: React.FC<StepProps> = ({ setActiveStep }) => {
  const { handleSubmit, control } = useForm();
  const [riderId, setRiderId] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("rider_id");
    if (id) setRiderId(id);
  }, []);
  
  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("rider_id", riderId || "");
      formData.append("vehicleType", data.vehicleType);
      formData.append("plateNumber", data.plateNumber);
      if (licenseFile) formData.append("license-upload", licenseFile); // licenseFile should be a File object

      const response = await fetch("https://api.kaya.ng/kaya-api/rider/save-vehicle-info.php", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit personal info");

      setActiveStep(3);
    } catch (err) {
      console.error("Personal Info Error:", err);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex mx-auto lg:w-[558px] w-full flex-col">
      <StepHeader step={2} />
      <StepTitle title="Tell Us About Your Ride! 🛵" />
      <div className="flex gap-5 mt-5 mb-6">
        <Image src={empty} width={64} height={64} alt="upload-icon" />
        <div className="flex flex-col gap-3">
          <p className="text-[16px] font-medium leading-6 tracking-[-6%] text-[#1E2023]">Upload Image of your Driver's license</p>
          <label
            htmlFor="license-upload"
            className="text-[14px] w-fit px-[10px] shadow-md py-[6px] border border-[#E2E4E9] rounded-[8px] font-medium leading-5 tracking-[2%] text-[#525866] cursor-pointer"
          >
            {licenseFile ? licenseFile.name : "upload"}
          </label>
          <input 
            type="file" 
            id="license-upload" 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files?.[0]) setLicenseFile(e.target.files[0]);
              console.log("License file:", licenseFile);
            }}/>
        </div>
      </div>

      <FormSelect name="vehicleType" control={control} icon={<Image src={bike} alt="bike" width={20} height={20} />} label="Your Vehicle Type" options={["Motorcycle", "Car", "Van"]} />
      <FormInput name="plateNumber" control={control} icon={<Keyboard className="size-5 text-gray-500" />} label="Vehicle Plate Number" placeholder="Enter your vehicle plate number" />

      <Button type="submit">Save and Continue</Button>
      <Button onClick={() => setActiveStep(null)} className="mt-5 bg-white text-primary border-[0.73px] border-[#00ABFD]">Cancel</Button>
    </form>
  );
};

export const GuarantorInfo: React.FC<StepProps> = ({ setActiveStep }) => {
  const { handleSubmit, control } = useForm();
  const [riderId, setRiderId] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("rider_id");
    if (id) setRiderId(id);
  }, []);
  
  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("rider_id", riderId || "");
      formData.append("guarantorName", data.guarantorName);
      formData.append("guarantorPhone", data.guarantorPhone);
      formData.append("guarantorAddress", data.guarantorAddress);

      const response = await fetch("https://api.kaya.ng/kaya-api/rider/guarantor-info.php", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit personal info");

      setActiveStep(4);
    } catch (err) {
      console.error("Personal Info Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex mx-auto lg:w-[558px] w-full flex-col">
      <StepHeader step={3} />
      <StepTitle title="Add a Guarantor for Extra Assurance" />

      <FormInput name="guarantorName" control={control} icon={<User className="size-5 text-gray-500" />} label="Guarantor’s Full Name" placeholder="Taiwo John" />
      <FormInput name="guarantorPhone" control={control} icon={<Phone className="size-5 text-gray-500" />} label="Guarantor’s Phone Number" placeholder="08012345678" />
      <FormInput name="guarantorAddress" control={control} icon={<Home className="size-5 text-gray-500" />} label="Guarantor’s Home Address" placeholder="23, Abiodun St..." />

      <Button type="submit">Save and Continue</Button>
      <Button onClick={() => setActiveStep(null)} className="mt-5 bg-white text-primary border-[0.73px] border-[#00ABFD]">Cancel</Button>
    </form>
  );
};

export const SuccessForm = ({ setOnboardingCompleted }: { setOnboardingCompleted: (completed: boolean) => void }) => (
  <div className="flex mx-auto lg:w-[558px] justify-center items-center w-full flex-col">
    <Image src={success} width={275} height={254} className="mb-[35px]" alt="success" />
    <p className="lg:text-[34px] text-[18px] font-semibold lg:leading-[38px] mb-4 tracking-[-6%] text-[#0A0D14]">Documents Submitted for Review</p>
    <p className="lg:text-[16px] text-[14px] text-center mb-[56px] max-w-[552px] font-normal leading-[21px] tracking-[-4%] text-[#8A8A8C]">
      Thank you for completing your setup! Our team is reviewing your documents. Once verified, you’ll be ready to start accepting delivery orders and earning with Kaya.
    </p>
    <button className="text-[#00ABFD] text-[16px] font-semibold leading-[20px] tracking-[-4%]" onClick={() => setOnboardingCompleted(true)}>
      Go to Dashboard
    </button>
  </div>
);
