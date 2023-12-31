import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function toPusherKey(key: string) {
  // console.log(key);
  const ans = key.replace(/:/g, "__");
  // console.log("123");
  return ans;
}
export function chatHrefConstructor(id1: string, id2: string) {
  const sorted = [id1, id2].sort();
  return `${sorted[0]}----${sorted[1]}`;
}
