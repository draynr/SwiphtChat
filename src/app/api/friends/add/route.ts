import { checkFriend } from "@/lib/validCheck/addFriend";

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
    const data = await RESTres.json();
  } catch (error) {}
}
