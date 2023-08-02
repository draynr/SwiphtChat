import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { id: idDeny } = z.object({ id: z.string() }).parse(body);
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idDeny);
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
