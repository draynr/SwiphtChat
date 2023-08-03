"use client";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface FriendRequestSideBarProps {
  sessionID: string;
  initUnseenRequests: number;
}

const FriendRequestSideBar: FC<FriendRequestSideBarProps> = ({
  sessionID,
  initUnseenRequests,
}) => {
  const [unseenNumRequests, setNumRequests] =
    useState<number>(initUnseenRequests);
  useEffect(() => {
    const friendRequestHandler = () => {
      setNumRequests((prev) => prev + 1);
    };
    const addedFriendHandler = () => {
      setNumRequests((prev) => prev - 1);
    };
    pusherClient.subscribe(
      toPusherKey(`user:${sessionID}:incoming_friend_requests`)
    );
    pusherClient.bind("incoming_friend_requests", friendRequestHandler);
    pusherClient.bind("new_friend", addedFriendHandler);
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionID}:incoming_friend_requests`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionID}:friends`));
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
      pusherClient.unbind("new_friend", addedFriendHandler);
    };
  }, [sessionID]);
  return (
    <Link
      href="/dashboard/requests"
      className="text-slate-100 hover:text-yellow-300 hover:bg-gray-80 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold active:bg-gray-700"
    >
      <div className="text-gray-900 border-gray-200 group-hover:border-gray-900 group-hover:text-gray-900 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend Requests</p>
      {unseenNumRequests > 0 ? (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-500">
          {unseenNumRequests}
        </div>
      ) : null}
    </Link>
  );
};

export default FriendRequestSideBar;
