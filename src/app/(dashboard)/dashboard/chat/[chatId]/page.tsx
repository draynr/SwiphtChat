import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { messagesArrayValidator } from "@/lib/validCheck/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import { db } from "@/lib/db";
import Image from "next/image";

interface PageProps {
  params: {
    chatId: string;
  };
}
async function getChatMessage(chatId: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:msgs`,
      0,
      -1
    );
    const messages = result.map((msg) => JSON.parse(msg) as Message).reverse();
    const parsedMsgs = messagesArrayValidator.parse(messages);
    return parsedMsgs;
  } catch (error) {
    notFound();
  }
}

const page = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const { user } = session;
  const [user1, user2] = chatId.split("----");
  if (user.id != user1 && user.id != user2) {
    notFound();
  }
  const partner = user.id === user1 ? user2 : user1;
  const partnerStruct = (await db.get(`user:${partner}`)) as User;
  const initMessages = await getChatMessage(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-4 max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-700">
        <div className="relative flex items-center space-x-4 px-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12 ">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={partnerStruct.image}
                alt={`${partnerStruct.name}'s pfp`}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-slate-100 mr-3 font-semibold">
                {partnerStruct.name}
              </span>
            </div>
            <span className="text-sm text-slate-200">
              {partnerStruct.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
