"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import UnseenMsg from "./ui/UnseenMsg";

interface SidebarChatListProps {
  friends: User[];
  sessionID: string;
}
interface ExtendedMsg extends Message {
  senderImg: string;
  senderName: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionID }) => {
  const [unseenmsg, setUnseenMsg] = useState<Message[]>([]);
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionID}:chats`));

    pusherClient.subscribe(toPusherKey(`user:${sessionID}:friends`));

    const friendHandler = () => {
      router.refresh();
    };
    const chatHandler = (msg: ExtendedMsg) => {
      const Notify =
        path !==
        `/dashboard/chat/${chatHrefConstructor(sessionID, msg.senderId)}`;
      if (!Notify) {
        return;
      }
      toast.custom((noti) => (
        <UnseenMsg
          noti={noti}
          sessionID={sessionID}
          senderName={msg.senderName}
          senderImage={msg.senderImg}
          senderID={msg.senderId}
          senderMsg={msg.text}
        />
      ));
      setUnseenMsg((prev) => [...prev, msg]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", friendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionID}:chats`));

      pusherClient.unsubscribe(toPusherKey(`user:${sessionID}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", friendHandler);
    };
  });
  useEffect(() => {
    if (path?.includes("chat")) {
      setUnseenMsg((prev) => {
        return prev.filter((msg) => !path.includes(msg.senderId));
      });
    }
  }, [path, sessionID, router]);
  return (
    <ul role="list" className="max-h[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend) => {
        const unseenMsgCnt = unseenmsg.filter((msg) => {
          return msg.senderId === friend.id;
        }).length;
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionID,
                friend.id
              )}`}
              className=" active:bg-gray-700 text-slate-100 hover:text-yellow-300 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-bold"
            >
              {friend.name}
              {unseenMsgCnt > 0 ? (
                <div className="bg-yellow-300 font-medium text-xs text-black h-4 w-4 rounded-full flex justify-center items-center">
                  {unseenMsgCnt}
                </div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
