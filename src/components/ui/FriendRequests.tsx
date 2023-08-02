"use client";
import { FC, useState } from "react";
import {
  Check,
  CheckCircle,
  UserCheck2,
  UserMinus2,
  UserPlus,
  UserSquare,
  Users,
  X,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionID: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionID,
}) => {
  const router = useRouter();
  const [fr, setFR] = useState<IncomingFriendRequest[]>(incomingFriendRequests);
  const deny = async (ID: string) => {
    await axios.post("/api/friends/accept", { id: ID });
    setFR((prev) => prev.filter((req) => req.ID != ID));
    router.refresh();
  };
  const accept = async (ID: string) => {
    await axios.post("/api/friends/accept", { id: ID });
    setFR((prev) => prev.filter((req) => req.ID != ID));
    router.refresh();
  };

  return (
    <>
      {fr.length === 0 ? (
        <p className="text-sm text-slate-100 px-6">
          No current incoming friend requests.
        </p>
      ) : (
        fr.map((request) => (
          <div
            key={request.ID}
            className="text-slate-100 flex gap-4 items-center"
          >
            <Users />
            <p className=" font-medium text-lg">{request.email}</p>
            <button
              onClick={() => accept(request.ID)}
              aria-label="Accept friend"
              className="w-8 h-8 bg-green-600 hover:bg-green-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <UserCheck2 className="font-semibold text-white w-3/4 h-3/4" />
            </button>

            <button
              onClick={() => deny(request.ID)}
              aria-label="Deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <UserMinus2 className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
