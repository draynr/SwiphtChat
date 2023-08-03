"use client";
import { cn, toPusherKey } from "@/lib/utils";
import { FC, useEffect, useRef, useState } from "react";
import { Message } from "@/lib/validCheck/message";
import format from "date-fns/format";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

interface MessagesProps {
  initMessages: Message[];
  sessionId: string;
  sessionImg: string | null | undefined;
  partner: User;
  chatId: string;
}

const Messages: FC<MessagesProps> = ({
  initMessages,
  sessionId,
  sessionImg,
  partner,
  chatId,
}) => {
  const [msgs, setMsgs] = useState<Message[]>(initMessages);

  pusherClient.subscribe(toPusherKey(`chat:${chatId}`));
  useEffect(() => {
    const messageHandler = (msg: Message) => {
      setMsgs((prev) => [msg, ...prev]);
    };
    pusherClient.bind("incoming-msg", messageHandler);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming-msg", messageHandler);
    };
  }, [chatId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const formatTimeStamp = (timestamp: number) => {
    return format(timestamp, "h:mm a");
  };
  return (
    <div
      id="messages"
      className="flex h-4 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-gray scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef}></div>
      {msgs.map((msg, index) => {
        const isCurrUser = msg.senderId === sessionId;
        const hasNextMsg = msgs[index - 1]?.senderId === msgs[index].senderId;
        return (
          <div key={`${msg.id}-${msg.timestamp}`} className="chat-message">
            <div
              className={cn("flex items-end", { "justify-end": isCurrUser })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrUser,
                    "order-2 items-start": !isCurrUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-blue-500 text-slate-100": isCurrUser,
                    "bg-gray-700 text-slate-100": !isCurrUser,
                    "rounded-br-none": !hasNextMsg && isCurrUser,
                    "rounded-bl-none": !hasNextMsg && !isCurrUser,
                  })}
                >
                  {msg.text}{" "}
                </span>
                <span className="ml-2 text-xs text-gray-400">
                  {formatTimeStamp(msg.timestamp)}
                </span>
              </div>
              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrUser,
                  "order-1": !isCurrUser,
                  invisible: hasNextMsg,
                })}
              >
                <Image
                  fill
                  src={isCurrUser ? (sessionImg as string) : partner.image}
                  alt="Profile Picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
