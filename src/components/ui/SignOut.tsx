"use client";
import { ButtonHTMLAttributes, FC } from "react";
import { useState } from "react";
import Button from "./Button";
import { toast } from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface SignOutProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOut: FC<SignOutProps> = ({ ...props }) => {
  const [signedOut, setSignedOut] = useState<boolean>(false);
  return (
    <Button
      {...props}
      variant="ghost"
      onClick={async () => {
        setSignedOut(true);
        try {
          await signOut();
        } catch (error) {
          toast.error("Problem signing out.");
        } finally {
          setSignedOut(false);
        }
      }}
    >
      {signedOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </Button>
  );
};

export default SignOut;
