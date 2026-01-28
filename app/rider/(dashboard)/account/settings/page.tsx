"use client";
export const dynamic = "force-dynamic";
import CountryPicker from "@/components/CountryPicker";
import FormInput from "@/components/FormInput";
import SuccessModal from "@/components/Overlays/SuccessModal";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Mail } from "lucide-react";
import React, { SyntheticEvent, useCallback, useState, useEffect } from "react";

const ProfileSettings: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [riderId, setRiderId] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // allow only digits
    setPhoneNumber(rawValue.replace(/^0/, "")); // remove leading zero
  };

  useEffect(() => {
    const id = sessionStorage.getItem("rider_id");
    if (id) {
      setRiderId(id);
    }
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("rider_id", riderId);
    formData.append("name", name);
    formData.append("phone", `+234${phoneNumber}`);
    formData.append("email", email);
  
    const imageFile = (document.getElementById("image") as HTMLInputElement)?.files?.[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }
    console.log(formData)
  
    try {
      const res = await fetch("https://api.kaya.ng/kaya-api/rider/update-profile-setting.php", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      if (data.status === "success") {
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("fullName", name);
        if (data.imageUrl) {
          sessionStorage.setItem("imageUrl", data.imageUrl);
        }
        setOpenModal(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Profile update failed");
    }
  };

  useEffect(() => {  
    fetch(`https://jbuit.org/api/rider/get-rider-profile.php?rider_id=${riderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setName(data.profile.name);
          setPhoneNumber(data.profile.phone);
          setEmail(data.profile.email);
          if (data.profile.profile_image) {
            setPreviewImage(data.profile.profile_image);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load profile", err);
      });
  }, []);
  

  const handleOpenModal = useCallback((state: boolean) => {
    setOpenModal(state);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="py-8 px-6 space-y-6 md:max-w-96 mx-auto my-8" >
      <div className="flex items-start gap-3 border-b border-b-foreground/20 py-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0 overflow-hidden">
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <User />
          )}
        </div>
        <div>
          <div className="flex flex-col items-start gap-2">
            <span className="">Upload Image</span>
            <small>Min 400x400px, PNG or JPEG</small>
            <>
              <label
                htmlFor="image"
                className="shadow shadow-foreground/20 px-3 py-1 rounded-md outline outline-1 outline-foreground/10">
                Upload
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                hidden
                multiple={false}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === "string") {
                        setPreviewImage(reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </>
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        <Label className="font-medium text-sm" htmlFor="name">
          Name
        </Label>
        <FormInput
          wrapperClassName={(isFocused) =>
            cn(!isFocused && "ring-1 ring-foreground/20")
          }
          leading={<User />}
          id="name"
          type="name"
          placeholder="full name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <div className="grid gap-2">
        <Label className="font-medium text-sm" htmlFor="phoneNumber">
          {"Recipient's"} Phone Number
        </Label>
        <FormInput
          wrapperClassName={(isFocused) =>
            cn(!isFocused && "ring-1 ring-foreground/20")
          }
          leading={
            <div className="w-16 overflow-visible border-r pr-2">
              +234
            </div>
          }
          id="phoneNumber"
          type="phone"
          placeholder="080 **** ****"
          onChange={handleChange}
          value={phoneNumber}
        />
      </div>

      <div className="grid gap-2">
        <Label className="font-medium text-sm" htmlFor="email">
          Email
        </Label>
        <FormInput
          wrapperClassName={(isFocused) =>
            cn(!isFocused && "ring-1 ring-foreground/20")
          }
          leading={<Mail />}
          id="email"
          type="email"
          placeholder="yourmail@email.com"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>

      <div className="flex md:flex-col items-center gap-3">
        <Button variant={"outline"}>Discard</Button>
        <Button onClick={() => handleOpenModal(true)}>Apply Changes</Button>
      </div>
      <SuccessModal
        title="Profile Updated"
        message="Changes to your profile has been updated successfully"
        showButton={false}
        isOpen={openModal}
        onClose={handleOpenModal}
      />
    </form>
  );
};

export default ProfileSettings;
