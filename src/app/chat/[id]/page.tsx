"use client";

import { useState, useEffect, useRef } from "react";
import { useNepalLawAI, type Message } from "@/hooks/use-nepal-law-ai";
import { Send, Scale, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isGenerating, backendStatus } = useNepalLawAI();
  const initialQueryProcessed = useRef(false);

  useEffect(() => {
    if (initialQueryProcessed.current) return;
    const savedQuery = localStorage.getItem('initialQuery');
    if (savedQuery) {
      sendMessage(savedQuery);
      localStorage.removeItem('initialQuery');
      initialQueryProcessed.current = true;
    }
  }, [sendMessage]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full bg-white font-[family-name:var(--font-geist-sans)]">
      <header className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
           <Scale className="text-blue-600" size={20} />
           <h1 className="font-bold text-slate-800">Nepal Legal Assistant</h1>
           <div className={`w-2 h-2 rounded-full ${backendStatus === 'open' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
        </div>
        <div className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-bold">RAG ACTIVE</div>
      </header>

      <ScrollArea className="flex-1 p-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col mb-8 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100 shadow-md' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
            }`}>
              {msg.content === '' && msg.role === 'assistant' ? (
                <div className="flex gap-1 items-center py-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              ) : <div className="whitespace-pre-wrap">{msg.content}</div>}
            </div>
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {msg.sources.map((src: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 bg-white border border-blue-100 p-2 rounded-lg text-[10px] text-blue-700 font-bold shadow-sm hover:bg-blue-50">
                    <BookOpen size={12} /> {src.law} • Sec {src.section}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </ScrollArea>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage(input), setInput(""))}
            placeholder={backendStatus === 'open' ? "Ask your legal question..." : "Waking up legal engine..."}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full py-3.5 px-6 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <Button onClick={() => { sendMessage(input); setInput(""); }} disabled={isGenerating || !input.trim()} className="rounded-full bg-blue-600 h-11 w-11 p-0 shadow-lg shadow-blue-100 active:scale-90 transition-transform">
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}