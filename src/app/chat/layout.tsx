"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/chat/sidebar";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* 
         Since you added 'hidden md:flex' to Sidebar, 
         it will disappear on mobile and this flex container 
         will give all the space to the <main> tag.
      */}
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative bg-white min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}