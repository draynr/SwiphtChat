import { chatHrefConstructor, cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";
import { Toast, toast } from "react-hot-toast";

interface UnseenMsgProps {
  noti: Toast;
  sessionID: string;
  senderID: string;
  senderImage: string;
  senderName: string;
  senderMsg: string;
}

const UnseenMsg: FC<UnseenMsgProps> = ({
  noti,
  sessionID,
  senderName,
  senderID,
  senderImage,
  senderMsg,
}) => {
  return (
    <div
      className={cn(
        "max-w-md w-full bg-gray-950 rounded-lg pointer-events-auto flex ring-1 ring-opacity-5",

        { "animate-enter": noti.visible, "animate-leave": !noti.visible }
      )}
    >
      <a
        href={`/dashboard/chat/${chatHrefConstructor(sessionID, senderID)}`}
        onClick={() => toast.dismiss(noti.id)}
        className="flex-1 w-0 p-4"
      >
        <div className="items-start flex">
          <div className="flex-shrink-0 pt-.5">
            <div className="relative h-10 w-10">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={senderImage}
                alt={`${senderName} profile pic`}
              />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-slate-100">{senderName}</p>
            <p className="text-sm mt-1 text-slate-100">{senderMsg}</p>
          </div>
        </div>
      </a>

      <div className="flex border-1 border-gray-200">
        <button
          onClick={() => toast.dismiss(noti.id)}
          className="focus:outline focus:ring-gray-950 w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-slate-100 hover:text-slate-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UnseenMsg;
