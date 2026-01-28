"use client";
export const dynamic = "force-dynamic";
import {
  GuarantorInfo,
  PersonalInfo,
  SuccessForm,
  VehicleInfo,
} from "../components/personal-info";
import React, { useState, useEffect } from "react";
import { CircleCheck, ChevronRight } from "lucide-react";
import { VerificationPage } from "../components/verificationComp";

const Page = () => {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      sessionStorage.setItem("rider_id", parsedUser.user["id"]);
    }
  }, []);

  const steps = [
    {
      title: "Personal Information",
      desc: "Fill out your personal details to fully get onboarded as a rider",
      icon: "📋",
      link: {
        text: "Complete Profile",
        action: () => {
          setActiveStep(1);
        },
      },
      status: "pending",
    },
    {
      title: "Document Verification",
      desc: "Upload your valid ID and driver’s license to verify your identity",
      icon: "✅",
      link: {
        text: "Upload Documents",
        action: () => {
          setActiveStep(2);
        },
      },
      status: "pending",
    },
    {
      title: "Guarantors details",
      desc: "Add your bank details to receive earnings securely and on time after every delivery.",
      icon: "💳",
      link: {
        text: "Add Bank Details",
        action: () => {
          setActiveStep(3);
        },
      },
      status: "pending",
    },
  ];

  if (!user) return null;
  if (onboardingCompleted) return <VerificationPage />;

  return (
    <div className="bg-[#F7FBFF] lg:py-[100px] py-[72px] px-[21px] lg:px-[68px]">
      {activeStep === null ? (
        <>
          <div className="flex flex-col mb-[60px] gap-3">
            <p className="lg:text-[32px] text-[28px] font-[600] text-[#475467] lg:leading-[39px] leading-[33px] tracking-tight">
              Hi {user?.user?.fullName}, Get Ready to Ride and Earn! 💼
            </p>
            <p className="lg:text-[18px] text-[16px] leading-[25px] tracking-tight">
              Complete your setup in three simple steps and start delivering today!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {steps.map((step, index) => (
              <div
                key={index}
                className="px-6 rounded-[8px] bg-[#FFFFFF] border border-[#DFF5FF] py-[30px] flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-[999px] border border-[#00ABFD] text-primary font-medium leading-4 tracking-wide w-fit px-2 py-[6px] bg-white flex items-center justify-center">
                    <span className="uppercase text-[12px]">step {index + 1} of 3</span>
                  </div>

                  {step.status === "completed" && (
                    <div className="rounded-[6px] border bg-[#EFFAF6] text-[#38C793] leading-4 text-[14px] gap-1 tracking-wide w-fit px-2 py-1 flex items-center justify-center">
                      <CircleCheck className="text-[#38C793] w-[16px] h-[16px]" />
                      Completed
                    </div>
                  )}
                </div>

                <span className="text-6xl mt-12 mb-4">{step.icon}</span>
                <p className="text-[29px] font-[600] text-primary mb-1 leading-[33px] tracking-tight">
                  {step.title}
                </p>
                <p className="text-[14px] text-[#475467] leading-[20px] tracking-tight">
                  {step.desc}
                </p>

                <div
                  onClick={step.link.action}
                  className="flex items-center mt-2 gap-1 cursor-pointer"
                >
                  <p className="text-[14px] text-[#475467] underline font-medium leading-[20px] tracking-tight">
                    {step.link.text}
                  </p>
                  <ChevronRight className="text-[#475467] w-[20px] h-[20px]" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : activeStep === 1 ? (
        <PersonalInfo setActiveStep={setActiveStep} />
      ) : activeStep === 2 ? (
        <VehicleInfo setActiveStep={setActiveStep} />
      ) : activeStep === 3 ? (
        <GuarantorInfo setActiveStep={setActiveStep} />
      ) : activeStep === 4 ? (
        <SuccessForm setOnboardingCompleted={setOnboardingCompleted} />
      ) : null}
    </div>
  );
};

export default Page;
