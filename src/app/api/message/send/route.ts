import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Message, messageValidator } from "@/lib/validCheck/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { date } from "zod";

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const [user1, user2] = chatId.split("----");
    if (session.user.id !== user1 && session.user.id !== user2) {
      return new Response("Unauthorized", { status: 401 });
    }
    const friend = session.user.id === user1 ? user2 : user1;
    const friendList = await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    );
    if (!friendList.includes(friend)) {
      return new Response("Unauthorized. Not friends.", { status: 401 });
    }
    const sender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const parsedSender = JSON.parse(sender) as User;
    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };
    const message = messageValidator.parse(messageData);

    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming-msg",
      message
    );
    await pusherServer.trigger(
      toPusherKey(`user:${friend}:chats`),
      "new_message",
      {
        ...message,
        senderImg: parsedSender.image,
        senderName: parsedSender.name,
      }
    );
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });
    return new Response("ok", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
