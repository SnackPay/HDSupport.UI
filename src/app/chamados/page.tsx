"use client";
import Header from "@/components/layout/header";
import { useState } from "react";
import ConversasList from "@/components/chamados/ConversasList";
import ChatArea from "@/components/chamados/ChatArea";
import { usePathname, useRouter } from "next/navigation";

export default function Page() {
  const [selectedChat, setSelectedChat] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-black"> 
      <div className="flex flex-1 h-full">
        <div className="w-96 max-w-sm border-r border-neutral-800 bg-neutral-900 flex flex-col h-full">
          <ConversasList onSelect={setSelectedChat} selectedChat={selectedChat} />
        </div>
        <div className="flex-1 flex flex-col h-full">
          <ChatArea chat={selectedChat} />
        </div>
      </div>
    </div>
  );
}