"use client";
export const dynamic = "force-dynamic";
import { CustomTextArea } from "@/components/CustomTextarea";
import { Button } from "@/components/ui/button";
import { RiderAvatar, StarRating } from "@/assets";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  Info,
  Loader,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  SendIcon,
  Smile,
} from "lucide-react";
import Image from "next/image";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChatMedia from "@/assets/chat-media.svg";
import MessagesEmpty from "@/assets/messages-empty.svg";

import { MainContent } from "@/app/layouts/app-layout";
import { DeliveryDetails } from "@/components/Overlays/DeliveryDetails";

export default function MessagingPage() {
  const [hasMessages, setHasMessages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setHasMessages(true);
      }, 2000);
    }, 2000);
  }, []);

  // useEffect(() => {
  //   if (!showRiderDetails) return;
  //   setTimeout(() => {
  //     setRideArrived(true);
  //   }, 3000);
  // }, [showRiderDetails]);

  const handleShowDetails = useCallback((state: boolean) => {
    setShowDetails(state);
  }, []);

  return (
    <MainContent>
      <div className="w-full flex gap-3 md:w-[96%] mx-auto">
        {loading ? (
          <div className="h-full w-full py-8 flex items-center justify-center">
            <Loader className="w-12 h-12 text-center text-primary animate-spin" />
          </div>
        ) : hasMessages ? (
          <>
            <div className="w-full flex flex-col bg-primary-lighter_ bg-primary/10 rounded-2xl my-2 max-h-[calc(100svh-6rem)] pb-4">
              <header className="w-full border-primary/30 border-b">
                <div className="w-[95%] mx-auto flex justify-between items-center py-5">
                  <div className="flex items-center gap-4">
                    <div>
                      <Image src={RiderAvatar} alt="rider" />
                    </div>
                    <div className="">
                      <div>
                        <p>Matthew Aaron</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p>Rider</p>
                        <Image src={StarRating} alt="rating" />
                        <span>4.5</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-lg text-primary">
                    <Phone />
                    <p className="hidden lg:inline-block">call rider</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center">
                        <MoreVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="rounded-xl divide-y font-medium w-72 mr-4">
                        <DropdownMenuItem className="py-2">
                          Media, Assets, Files
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2">
                          Back to delivery Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2 text-destructive">
                          Cancel Request
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </header>
              <div className="flex-1 overflow-auto no-scrollbar">
                <div className="w-[95%] mx-auto flex flex-col gap-3">
                  <Message id="" sender="me" content="I'm here." />
                  <Message id="" sender="rider" content="Where are you?" />
                  <Message id="" sender="me" content="I'm here." />
                  <Message id="" sender="rider" content="Where are you?" />
                  <Message id="" sender="me" content="I'm here." />
                  <Message id="" sender="rider" content="Where are you?" />
                </div>
              </div>
              <div className="space-y-3 mt-6 w-[95%] mx-auto">
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {QUICK_CHAT_MESSAGES?.map((message, i) => (
                    <QuickButton key={i} text={message} />
                  ))}
                </div>
                <div className="bg-background border border-foreground/20 rounded-xl overflow-clip divide-y divide-foreground/20">
                  <div className="flex px-4">
                    <CustomTextArea
                      placeholder="Enter your message"
                      className="w-full md:w-full border-none resize-none"
                    />
                    <button className="text-primary ">
                      <SendIcon className="stroke-none fill-primary" />
                    </button>
                  </div>
                  <div className="py-3">
                    <div className="flex items-center gap-2 divide-x divide-foreground/20">
                      <button className="px-4">
                        <Mic />
                      </button>
                      <div>
                        <button className="px-4">
                          <Smile />
                        </button>
                        <button className="px-4">
                          <Paperclip />
                        </button>
                      </div>

                      <button className="px-4">
                        <MoreVertical />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block bg-background w-96 h-full px-3 space-y-4">
              <Accordion type="single" collapsible className="">
                <AccordionItem value="1" title="Media, Assets, Files">
                  <AccordionTrigger>Media, assets, files (05)</AccordionTrigger>
                  <AccordionContent className="flex items-center py-4 px-2 gap-3 overflow-x-auto no-scrollbar">
                    {[0, 0, 0, 0, 0].map((media, i) => (
                      <Image src={ChatMedia} alt="media" key={i} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="px-1 space-y-4">
                <Button>Back to Delivery Details</Button>
                <Button variant={"outline"} className="text-primary">
                  Cancel Request
                </Button>
              </div>
              <DeliveryDetails
                withMoreActions={false}
                open={showDetails}
                onOpenChange={handleShowDetails}>
                <Button
                  variant={"ghost"}
                  className="text-primary justify-normal px-1 mt-16">
                  <Info />
                  <span>View Ride Details</span>
                  <ChevronRight className="ml-auto" />
                </Button>
              </DeliveryDetails>
            </div>
          </>
        ) : (
          <NoMessages />
        )}
      </div>
    </MainContent>
  );
}

const QUICK_CHAT_MESSAGES = [
  "Where are you?",
  "I'm here.",
  "On my way.",
  "Almost there.",
  "Share your location.",
  "Stuck in traffic.",
];

const QuickButton = memo(({ text }: { text: string }) => {
  // const { sendMessage } = useApi().chat;
  const sendQuickMessage = useCallback(async () => {
    // await sendMessage(text)
  }, []);

  return (
    <Button
      onClick={sendQuickMessage}
      variant="default"
      className={"py-2 px-4 rounded-full"}>
      <p className={""}>{text}</p>
    </Button>
  );
});

QuickButton.displayName = "QuickButton";

export type MessageType = {
  sender: string;
  content: string;
  id: string;
  timestamp?: number;
};

const Message = memo(({ sender, content }: MessageType) => {
  // const { user } = useUser();

  // const isOwnMessage = sender === user?.id;
  const isOwnMessage = sender === "me";
  return (
    <div className="mt-8 w-full">
      <div
        className={cn(
          "flex items-end gap-2 w-full",
          isOwnMessage ? "self-end flex-row-reverse" : "flex-row"
        )}>
        <div className="mb-2">
          <Image src={RiderAvatar} alt="rider" />
        </div>
        <div className="space-y-1">
          <div
            className={cn(
              "p-4 rounded-2xl ",
              isOwnMessage
                ? `bg-primary rounded-br-none  text-white`
                : `bg-background border rounded-bl-none`
            )}>
            <p className="text-md">{content}</p>
          </div>
          <div className="flex">
            <Check />
            <span>10:43 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
});
Message.displayName = "Message";

function NoMessages() {
  return (
    <div className="space-y-6 flex flex-col items-center w-fit mx-auto text-center py-8">
      <Image src={MessagesEmpty} alt="chat" />

      <p className="text-2xl font-semibold">No Messages Yet! 📭</p>
      <span className=" text-foreground/60">
        Your inbox is empty! 🗨️ Book a delivery to start connecting with your
        rider.
      </span>
      <div className="w-full px-6">
        <Button>Book a delivery Now</Button>
      </div>
    </div>
  );
}
