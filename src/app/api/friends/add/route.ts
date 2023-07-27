import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { checkFriend } from "@/lib/validCheck/addFriend";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { db } from "@/lib/db";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: emailToAdd } = checkFriend.parse(body.email);
    //fetch data from db
    const idReq = await fetchRedis("get", `user:email:${emailToAdd}` as string);
    //id not found
    // console.log(idReq);
    if (!idReq) {
      return new Response("ID not recognized.", { status: 400 });
    }
    const session = await getServerSession(authOptions);
    // console.log(session);
    if (!session) {
      return new Response("Unauthorized Request.", { status: 401 });
    }
    if (idReq === session.user.id) {
      return new Response("Loner detected.", { status: 400 });
    }

    console.log("---------123");
    //check if the friend is already added.
    const alreadyRequested = (await fetchRedis(
      "sismember",
      `user:${idReq}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;
    console.log("---------456");
    if (alreadyRequested) {
      return new Response(
        "Already sent a friend request. Awaiting for response..",
        { status: 400 }
      );
    }

    const alreadyAdded = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idReq
    )) as 0 | 1;
    if (alreadyAdded) {
      return new Response("User is already added as a friend.", {
        status: 400,
      });
    }
    await db.sadd(`user:${idReq}:incoming_friend_requests`, session.user.id);
    return new Response("Ok.", { status: 200 });
  } catch (error) {
    // console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload.", { status: 422 });
    }
    return new Response("Invalid request.", { status: 400 });
  }
}
