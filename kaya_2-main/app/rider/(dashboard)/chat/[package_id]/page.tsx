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
import React, { memo, useRef, useCallback, useEffect, useState } from "react";
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
import { useParams } from "next/navigation";

export default function MessagingPage() {
  const [hasMessages, setHasMessages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const params = useParams();
  const packageId = params.package_id;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [senderId, setSenderId] = useState<number | null>(null);
  const [receiverId, setReceiverId] = useState<number | null>(null);

  const ws = useRef<WebSocket | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  

  type Message = {
    id?: number;
    sender_id: number;
    receiver_id: number;
    package_id: number;
    content: string;
    created_at?: string;
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setHasMessages(true);
      }, 2000);
    }, 2000);
  }, []);

  const handleShowDetails = useCallback((state: boolean) => {
    setShowDetails(state);
  }, []);

  // ✅ Fetch sender_id and receiver_id dynamically
  useEffect(() => {
    async function fetchSenderReceiver() {
      try {
        const response = await fetch(`https://api.kaya.ng/kaya-api/chat/get-chat-id.php?package_id=${packageId}`);
        const result = await response.json();

        if (result.status === 'success') {
          setSenderId(result.sender_id);
          setReceiverId(result.receiver_id);

          // Optionally save receiverId to sessionStorage
          sessionStorage.setItem('receiver_id', result.receiver_id);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Failed to fetch sender and receiver info:", error);
      }
    }

    if (packageId) {
      fetchSenderReceiver();
    }
  }, [packageId]);

  // ✅ Connect WebSocket
  useEffect(() => {
    if (!packageId) return;

    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => console.log('Connected to WebSocket');
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.package_id == packageId) {
        setMessages(prev => [...prev, data]);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [packageId]);

  useEffect(() => {
    if (!packageId) return;
  
    const fetchMessages = async () => {
      try {
        const res = await fetch(`https://api.kaya.ng/kaya-api/chat/fetch-messages.php?package_id=${packageId}`);
        const response = await res.json();
  
        if (response.success) {
          setMessages(response.data || []); // data is the array of {content: string}
        } else {
          console.error("Error fetching messages:", response.error);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
  
    fetchMessages();
  }, [packageId]);
  

  // ✅ Sending messages
  const sendMessage = async () => {
    if (!newMessage.trim() || senderId === null || receiverId === null) return;

    const payload = {
      sender_id: senderId,
      receiver_id: receiverId,
      package_id: packageId,
      content: newMessage,
    };

    try {
      // Send to API
      await fetch('https://api.kaya.ng/kaya-api/chat/send-message.php', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Send to WebSocket
      ws.current?.send(JSON.stringify(payload));

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

const [isRecording, setIsRecording] = useState(false);
const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const audioChunksRef = useRef<Blob[]>([]);

const handleMicClick = async () => {
  if (!isRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-message.webm');
      formData.append('sender_id', String(senderId));
      formData.append('receiver_id', String(receiverId)); // corrected spelling
      formData.append('package_id', String(packageId));
          

      fetch('https://api.kaya.ng/kaya-api/chat/send-audio.php', {
        method: 'POST',
        body: formData,
      }).catch(console.error);
    };

    mediaRecorder.start();
    setIsRecording(true);
  } else {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }
};


  return (
    <MainContent>
      <div className="w-full flex gap-3 md:w-[96%] mx-auto">
        {loading ? (
          <div className="h-full w-full py-8 flex items-center justify-center">
            <Loader className="w-12 h-12 text-center text-primary animate-spin" />
          </div>
        ) : hasMessages ? (
          <>
            {/* Chat Area */}
            <div className="w-full flex flex-col bg-primary-lighter_ bg-primary/10 rounded-2xl my-2 max-h-[calc(100svh-6rem)] pb-4">
              {/* Header */}
              <header className="w-full border-primary/30 border-b">
                <div className="w-[95%] mx-auto flex justify-between items-center py-5">
                  <div className="flex items-center gap-4">
                    <Image src={RiderAvatar} alt="rider" />
                    <div>
                      <p>Matthew Aaron</p>
                      {/*
                      <div className="flex items-center gap-2">
                        <p>Rider</p>
                        <Image src={StarRating} alt="rating" />
                        <span>4.5</span>
                      </div>
                      */}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-lg text-primary">
                    <Phone />
                    <p className="hidden lg:inline-block">call user</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center">
                        <MoreVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="rounded-xl divide-y font-medium w-72 mr-4">
                        <DropdownMenuItem className="py-2">
                          Media, Assets, Files
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2">
                          Back to Delivery Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2 text-destructive">
                          Cancel Request
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </header>
  
              {/* Messages */}
              <div className="flex-1 overflow-auto no-scrollbar py-4">
                <div className="w-[95%] mx-auto flex flex-col gap-3">
                  {Array.isArray(messages) && messages.map((message) =>  (
                    <Message
                      key={message.id ?? Math.random()} // fallback in case no id
                      id={message.id?.toString() || ""}
                      sender={message.sender_id === receiverId ? "me" : "rider"}
                      content={message.content}
                    />
                  ))}
                  <div ref={bottomRef} />
                </div>
              </div>
  
              {/* Quick Chat + Input */}
              <div className="space-y-3 mt-6 w-[95%] mx-auto">
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {QUICK_CHAT_MESSAGES.map((message, i) => (
                    <QuickButton key={i} text={message} sendMessage={setNewMessage} />
                  ))}
                </div>
  
                {/* Textarea & Buttons */}
                <div className="bg-background border border-foreground/20 rounded-xl overflow-clip divide-y divide-foreground/20">
                  <div className="flex px-4">
                    <CustomTextArea
                      placeholder="Enter your message"
                      className="w-full md:w-full border-none resize-none"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button onClick={sendMessage} className="text-primary">
                      <SendIcon className="stroke-none fill-primary" />
                    </button>
                  </div>
                  <div className="py-3">
                    <div className="flex items-center gap-2 divide-x divide-foreground/20">
                      <button className="px-4" onClick={handleMicClick}>
                        <Mic className={isRecording ? "text-red-500" : ""} />
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
  
            {/* Sidebar for large screen */}
            <div className="hidden lg:block bg-background w-96 h-full px-3 space-y-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="1" title="Media, Assets, Files">
                  <AccordionTrigger>Media, assets, files (05)</AccordionTrigger>
                  <AccordionContent className="flex items-center py-4 px-2 gap-3 overflow-x-auto no-scrollbar">
                    {[0, 0, 0, 0, 0].map((_, i) => (
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

const QuickButton = memo(({ text, sendMessage }: { text: string, sendMessage: (text: string) => void }) => {
  const handleQuickSend = () => {
    sendMessage(text); // Sets message text directly
  };

  return (
    <Button
      onClick={handleQuickSend}
      variant="default"
      className="py-2 px-4 rounded-full">
      <p>{text}</p>
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
    <div className={cn("mt-8 flex", isOwnMessage ? "justify-start":"justify-end" )}>
        <div className={cn(
          "flex items-end gap-2",
          isOwnMessage ? "flex-row":"flex-row-reverse"  
        )}>
        <div className="mb-2">
          <Image src={RiderAvatar} alt="rider" />
        </div>
        <div className="space-y-1">
          <div
            className={cn(
              "p-4 rounded-2xl ",
              isOwnMessage
                ? `bg-background border rounded-bl-none`
                : `bg-primary rounded-br-none  text-white`
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
