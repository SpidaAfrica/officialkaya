"use client";
export const dynamic = "force-dynamic";

import React, { useCallback, useEffect, useState, SyntheticEvent } from "react";
import CountryPicker from "@/components/CountryPicker";
import FormInput from "@/components/FormInput";
import SuccessModal from "@/components/Overlays/SuccessModal";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Mail } from "lucide-react";

const ProfileSettings: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = sessionStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("fullName", name);
    formData.append("email", email);

    const imageInput = document.getElementById("image") as HTMLInputElement;
    if (imageInput?.files?.[0]) {
      formData.append("image", imageInput.files[0]);
    }

    try {
      const response = await fetch("https://api.kaya.ng/kaya-api/update-profile.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success === true) {
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("fullName", name);
        if (result.imageUrl) {
          sessionStorage.setItem("imageUrl", result.imageUrl);
        }
        setOpenModal(true);
      } else {
        alert("Update failed: " + result.message);
      }
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  const handleOpenModal = useCallback((state: boolean) => {
    setOpenModal(state);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="py-8 px-6 space-y-6 md:max-w-lg mx-auto my-8"
    >
      <div className="flex items-start gap-3 border-b border-b-foreground/20 py-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0 overflow-hidden">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User />
          )}
        </div>
        <div>
          <div className="flex flex-col items-start gap-2">
            <span className="">Upload Image</span>
            <small>Min 400x400px, PNG or JPEG</small>
            <label
              htmlFor="image"
              className="shadow shadow-foreground/20 px-3 py-1 rounded-md outline outline-1 outline-foreground/10 cursor-pointer"
            >
              Upload
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            {imageName && (
              <span className="text-sm text-muted-foreground mt-1">{imageName}</span>
            )}
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
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
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
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" type="button">
          Discard
        </Button>
        <Button type="submit">Apply Changes</Button>
      </div>

      <SuccessModal
        title="Profile Updated"
        message="Changes to your profile have been updated successfully."
        showButton={false}
        isOpen={openModal}
        onClose={handleOpenModal}
      />
    </form>
  );
};

export default ProfileSettings;
