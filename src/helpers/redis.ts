const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
  const commandUrl = `${REST_URL}/${command}/${args.join("/")}`;
  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Error executing Redis command:${response.statusText}`);
  }
  const data = await response.json();
  return data.result;
}
