"use client";
import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useState } from "react";

interface SidebarChatListProps {
  friends: User[];
  sessionID: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionID }) => {
  const [unseenmsg, setUnseenMsg] = useState<Message[]>([]);
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (path?.includes("chat")) {
      setUnseenMsg((prev) => {
        return prev.filter((msg) => !path.includes(msg.senderId));
      });
    }
  }, [path]);
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
              className="text-slate-100 hover:text-yellow-300 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-bold"
            >
              {friend.name}
              {unseenMsgCnt > 0 ? (
                <div className="bg-slate-100 font-medium text-xs text-white h-4 w-4 rounded-full flex justify-center items-center">
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
