import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC, ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icons, Icon } from "@/components/Icons";
import Image from "next/image";
import SignOut from "@/components/ui/SignOut";
import FriendRequestSideBar from "@/components/ui/FriendRequestSideBar";
import { fetchRedis } from "@/helpers/redis";
import { getFriendsByUserId } from "@/helpers/getFriendsByUserId";
import SidebarChatList from "@/components/SidebarChatList";
import { FormInput } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}
interface SideBarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}
const sideBarOptions: SideBarOption[] = [
  { id: 1, name: "Add Friend", href: "/dashboard/add", Icon: "UserPlus" },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }
  const reqCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;
  const friends = await getFriendsByUserId(session.user.id);

  return (
    <div className="w-full flex h-screen">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <FormInput className="h-8 w-auto text-yellow-300 " />
          <h1 className=" px-4 text-yellow-300 font-lg font-semibold">
            SwiphChat
          </h1>
        </Link>
        {friends.length > 0 ? (
          <div className="text-xl font-semibold leading-7 text-slate-100">
            Messages
          </div>
        ) : null}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList friends={friends} sessionID={session.user.id} />
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-slate-100">
                Overview
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {sideBarOptions.map((option) => {
                    const Icon = Icons[option.Icon];
                    return (
                      <li key={option.id}>
                        {" "}
                        <Link
                          href={option.href}
                          className="group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold text-white hover:text-yellow-400  active:bg-gray-700"
                        >
                          <span className="text-gray-900 border-gray-200 group-hover:border-gray-900 group-hover:text-gray-900 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[.625rem] font-medium bg-white">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="truncate"> {option.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <FriendRequestSideBar
                      sessionId={session.user.id}
                      initUnseenRequests={reqCount}
                    />
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <li className="-mx-6 mt-auto flex items-center">
            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-slate-100">
              <div className="relative h-8 w-8 bg-gray-40">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={session.user.image || ""}
                  alt="pfp"
                />
              </div>
              <span className="sr-only">Your Profile</span>
              <div className="flex flex-col">
                <span aria-hidden="true">{session.user.name}</span>
                <span className="text-xs text-zinc-400" aria-hidden="true">
                  {session.user.email}
                </span>
              </div>
            </div>
            <SignOut className="text-white h-full full-aspect-square" />
          </li>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default Layout;
