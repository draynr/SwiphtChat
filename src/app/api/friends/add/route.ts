import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { checkFriend } from "@/lib/validCheck/addFriend";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: emailToAdd } = checkFriend.parse(body.email);
    //fetch data from db
    const RESTres = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: "no-store",
      }
    );
    const data = (await RESTres.json()) as { result: string };
    const idReq = data.result;
    //id not found
    if (!idReq) {
      return new Response("ID not recognized.", { status: 400 });
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized Request.", { status: 401 });
    }
    if (idReq === session.user.id) {
      return new Response("Loner detected.", { status: 400 });
    }

    const alreadyAdded = fetchRedis("sismember");

    console.log(data);
  } catch (error) {}
}
