"use client";
import TextareaAutosize from "react-textarea-autosize";
import { FC, useRef, useState } from "react";
import Button from "./ui/Button";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ChatInputProps {
  partner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ partner, chatId }) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const sendMessage = async () => {
    if (!input) {
      return;
    }
    setLoading(true);

    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      textAreaRef.current?.focus();
    } catch (error) {
      toast.error("Something went wrong. Please try again");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="px-4 pt-2 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-500 focus-within:ring-2 focus-withing:ring-yellow-300">
        <TextareaAutosize
          ref={textAreaRef}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          placeholder={`Message ${partner.name}...`}
          className="block w-full resize-none border-0 bg-transparent text-slate-100 placeholder:text-slate-400 focus:ring-0 sm:py-1.5"
        />
        <div
          onClick={() => textAreaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>
        <div className=" absolute right-0 bottom-1 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button
              onClick={sendMessage}
              type="submit"
              className="hover:bg-gray-950"
              isLoading={loading}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
