"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/chat/sidebar";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative bg-white">
        {children}
      </main>
    </div>
  );
}