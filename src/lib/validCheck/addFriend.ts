import { z } from "zod";
export const checkFriend = z.object({
  email: z.string().email(),
});
