import { getServerSession } from "next-auth";
import { FC } from "react";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { fetchRedis } from "@/helpers/redis";
import FriendRequests from "@/components/ui/FriendRequests";

const page: FC = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const incomingRequested = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];
  //get user emails instead of displaying ids
  const incomingRequestedEmails = await Promise.all(
    incomingRequested.map(async (ID) => {
      const sendEmail = (await fetchRedis("get", `user:${ID}`)) as string;
      const sendParse = JSON.parse(sendEmail) as User;
      return { ID, email: sendParse.email };
    })
  );
  return (
    <main className="pt-6">
      <h1 className="font-bold text-5xl mb-8"></h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingRequestedEmails}
          sessionID={session.user.id}
        />
      </div>
    </main>
  );
};

export default page;
