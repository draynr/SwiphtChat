import AddFriend from "@/components/ui/AddFriend";
import { FC } from "react";
import Layout from "../layout";

const page: FC = () => {
  return (
    <main className="pt-8">
      <h2 className="font-bold text-5xl mb-8">
        <AddFriend />
      </h2>
    </main>
  );
};

export default page;
