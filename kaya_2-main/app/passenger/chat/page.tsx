"use client";
export const dynamic = "force-dynamic";

import { CustomTextArea } from "@/components/CustomTextarea";
import { Button } from "@/components/ui/button";
import { RiderAvatar, StarRating } from "@/assets";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Info,
  Loader,
  Mic,
  MoreVertical,
  Paperclip,
  SendIcon,
  Smile,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef, memo } from "react";
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
import { MainContent } from "@/app/layouts/app-layout";
import { DeliveryDetails } from "@/components/Overlays/DeliveryDetails";
import { DoubleTick, PhoneIcon } from "@/lib/icons";
import RiderRating from "@/components/Overlays/Rating";
import Link from "next/link";

interface MessageType {
  sender_id: string;
  content: string;
  timestamp?: string;
}

interface RiderDetailsType {
  name: string;
  phone: string;
  rating: number;
  avatar: string;
}

export default function MessagingPage(): JSX.Element {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [riderId, setRiderId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [riderDetails, setRiderDetails] = useState<RiderDetailsType>({
    name: "Loading...",
    phone: "",
    rating: 0,
    avatar: RiderAvatar,
  });
  const [isSending, setIsSending] = useState(false); // for preventing spamming
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async (id: string) => {
    try {
      const res = await fetch(`https://api.kaya.ng/kaya-api/chat/fetch-messages.php?chat_id=${id}`);
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

useEffect(() => {
  if (typeof window === "undefined") return;

  const storedUser = sessionStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  if (!parsedUser?.id) return;

  const fetchAcceptedRider = async () => {
    try {
      const res = await fetch("https://api.kaya.ng/kaya-api/get-accepted-rider.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user_id: parsedUser.id }),
      });

      const result = await res.json();

      if (result.success && result.rider) {
        const rider = result.rider;
        setSenderId(parsedUser.id);
        setChatId(result.chat_id);
        setRiderId(rider.id);
        setRiderDetails({
          name: rider.name,
          phone: rider.phone,
          rating: parseFloat(rider.rating) || 0,
          avatar: rider.avatar || RiderAvatar,
        });

        if (result.chat_id) {
          fetchMessages(result.chat_id);
        }
      } else {
        console.warn("No accepted rider found.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch accepted rider", err);
      setLoading(false);
    }
  };

  fetchAcceptedRider();
}, []);


  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || !senderId || isSending) return;

    setIsSending(true);
    const messageData = {
      chat_id: chatId,
      sender_id: senderId,
      content: newMessage,
    };

    try {
      const res = await fetch("https://api.kaya.ng/kaya-api/chat/send-message.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(messageData),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            content: newMessage,
            sender_id: senderId,
            timestamp: new Date().toISOString(),
          },
        ]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message", err);
    } finally {
      setIsSending(false);
    }
  };

  const sendQuickMessage = useCallback(
    async (text: string) => {
      setNewMessage(text);
      await handleSendMessage();
    },
    [newMessage, isSending, chatId, senderId]
  );

  const handleShowDetails = useCallback((state: boolean) => {
    setShowDetails(state);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <MainContent>
      <div className="w-full flex gap-3 md:w-[96%] mx-auto">
        {loading ? (
          <div className="h-full w-full py-8 flex items-center justify-center">
            <Loader className="w-12 h-12 text-center text-primary animate-spin" />
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col bg-primary/10 rounded-2xl my-2 max-h-[calc(100svh-6rem)] pb-4">
              <header className="w-full border-primary/30 border-b">
                <div className="w-[95%] mx-auto flex justify-between items-center py-5">
                  <div className="flex items-center gap-4">
                    {riderDetails.avatar && (
                      <Image
                        src={riderDetails.avatar}
                        alt="rider"
                        className="rounded-full w-12 h-12"
                        //onError={(e) => (e.target.src = RiderAvatar)} // Fallback avatar
                      />
                    )}
                    <div>
                      <p className="font-semibold">{riderDetails.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Rating:</span>
                        {typeof StarRating === "string" ? (
                          <Image src={StarRating} alt="rating" />
                        ) : (
                          <StarRating />
                        )}
                        <span>{riderDetails.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-lg text-primary">
                    {riderDetails.phone && (
                      <a href={`tel:${riderDetails.phone}`} className="flex items-center gap-2">
                        <PhoneIcon />
                        <span className="hidden lg:inline-block">Call Rider</span>
                      </a>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center">
                        <MoreVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="rounded-xl divide-y font-medium w-72 mr-4">
                        <DropdownMenuItem className="py-2">Media, Assets, Files</DropdownMenuItem>
                        <DropdownMenuItem className="py-2">Back to delivery Details</DropdownMenuItem>
                        <DropdownMenuItem className="py-2 text-destructive">Cancel Request</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </header>
              <div className="flex-1 overflow-auto no-scrollbar">
                <div className="w-[95%] mx-auto flex flex-col gap-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm italic">
                      No messages yet. Start the conversation.
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <Message
                        key={`${msg.sender_id}-${i}`}
                        sender={msg.sender_id === senderId ? "me" : "rider"}
                        content={msg.content}
                        timestamp={msg.timestamp}
                      />
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>
              <div className="space-y-3 mt-6 w-[95%] mx-auto">
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {QUICK_CHAT_MESSAGES.map((message) => (
                    <QuickButton key={message} text={message} onClick={() => sendQuickMessage(message)} />
                  ))}
                </div>
                <div className="bg-background border border-foreground/20 rounded-xl overflow-clip divide-y divide-foreground/20">
                  <div className="flex px-4">
                    <CustomTextArea
                      placeholder="Enter your message"
                      className="w-full md:w-full border-none resize-none"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button className="text-primary " onClick={handleSendMessage} disabled={isSending}>
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
              <Accordion type="single" collapsible>
                <AccordionItem value="1" title="Media, Assets, Files">
                  <AccordionTrigger>Media, assets, files (05)</AccordionTrigger>
                  <AccordionContent className="flex items-center py-4 px-2 gap-3 overflow-x-auto no-scrollbar">
                    {[0, 0, 0, 0, 0].map((_, i) => (
                      <div className="bg-gray-200 w-20 h-20 rounded-lg" key={i} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="px-1 space-y-4">
                <RiderRating>
                  <Button>Back to Delivery Details</Button>
                </RiderRating>
                <Button variant="outline" asChild className="text-primary">
                  <Link href="/passenger/home">Cancel Request</Link>
                </Button>
              </div>
              <DeliveryDetails open={showDetails} onOpenChange={handleShowDetails}>
                <Button variant="ghost" className="text-primary justify-normal px-1 mt-16">
                  <Info />
                  <span>View Ride Details</span>
                  <ChevronRight className="ml-auto" />
                </Button>
              </DeliveryDetails>
            </div>
          </>
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

type QuickButtonProps = {
  text: string;
  onClick: () => void;
};

const QuickButton = memo(({ text, onClick }: QuickButtonProps): JSX.Element => (
  <Button variant="secondary" className="min-w-[10rem]" onClick={onClick}>
    {text}
  </Button>
));

function Message({ sender, content, timestamp }: { sender: string; content: string; timestamp?: string }): JSX.Element {
  return (
    <div className={cn("message", { "message-me": sender === "me", "message-rider": sender === "rider" })}>
      <p>{content}</p>
      {timestamp && <p className="text-xs text-gray-500">{new Date(timestamp).toLocaleTimeString()}</p>}
    </div>
  );
}
