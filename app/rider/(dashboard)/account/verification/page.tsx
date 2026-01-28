"use client";
export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import empty from "@/assets/empty.svg";
import React, { SyntheticEvent } from "react";
import { AltInput, AltSelect } from "../../components/Alt";
import Image from "next/image";
import { Keyboard } from "lucide-react";
import bike from "@/assets/bike.svg";
import SuccessModal from "@/components/Overlays/SuccessModal";
import GoBack from "@/components/Overlays/GoBack";

const ProfileSettings: React.FC = () => {
  // const [name, setName] = useState("Taiwo");
  // const [phoneNumber, setPhoneNumber] = useState("+234-1555-000-0000");
  // const [email, setEmail] = useState("taiwo@gmail.com");
  // const [openModal, setOpenModal] = useState(false);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  // const handleOpenModal = useCallback((state: boolean) => {
  //   setOpenModal(state);
  // }, []);

  return (
    <>
      <div>
        <GoBack />
      </div>
      <form
        onSubmit={handleSubmit}
        className="py-8 px-6 space-y-6 mx-auto my-8">
        <div className=" flex mx-auto lg:w-[558px] w-full flex-col ">
          <div className="flex gap-5 mt-5 mb-6">
            <Image src={empty} width={64} height={64} alt="personal-info" />
            <div className="flex flex-col gap-3">
              <p className=" text-[16px] font-medium leading-6 tracking-[-6%] text-[#1E2023]">
                Upload Image of your Drivers license
              </p>

              <label
                htmlFor="upload"
                className="text-[14px] w-fit px-[10px] shadow-[0px_1px_2px_0px_rgba(82,88,102,0.06)]  py-[6px] border border-[#E2E4E9] rounded-[8px] font-medium leading-5 tracking-[2%] text-[#525866]">
                Upload
              </label>
              <input type="file" id="upload" className="hidden" />
            </div>
          </div>

          <AltSelect
            icon={<Image src={bike} width={20} height={20} alt="bike" />}
            label="Your Vehicle Type"
            options={["Option 1", "Option 2", "Option 3"]}
          />
          <AltInput
            icon={<Keyboard className="size-5" color="#868C98" />}
            label="Vehicle Plate Number"
            placeholder="Enter your vehicle plate number"
          />

          <SuccessModal
            title="Details Updated Successfully"
            message="Your new bank details has been successfully updated"
            showButton={false}>
            <Button>Save and Continue</Button>
          </SuccessModal>

          <Button className="bg-white text-primary mt-4 border-[#00ABFD] border-[0.73px]">
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileSettings;
