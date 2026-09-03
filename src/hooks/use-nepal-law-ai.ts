"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export type Message = { 
  role: 'user' | 'assistant'; 
  content: string; 
  sources?: any[] 
};

export function useNepalLawAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendStatus, setStatus] = useState<'connecting' | 'open'>('connecting');
  const { id } = useParams();
  
  const socketRef = useRef<WebSocket | null>(null);
  const activeConvIdRef = useRef<string | null>(null);
  const pendingMessageRef = useRef<string | null>(null);

  // 1. MEMORY: Load History from Supabase
  useEffect(() => {
    const loadHistory = async () => {
      if (!id || id === 'new') {
        setMessages([]);
        activeConvIdRef.current = null;
        return;
      }
      
      activeConvIdRef.current = id as string;
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data.map(m => ({ 
          role: m.role as 'user' | 'assistant', 
          content: m.content, 
          sources: m.sources 
        })));
      }
    };
    loadHistory();
  }, [id]);

  // 2. ENGINE: WebSocket with Cold-Start Protection
  useEffect(() => {
    const connectWS = () => {
      const socket = new WebSocket('wss://yamraj047-gguf-with-rag.hf.space/ws');
      socketRef.current = socket;

      socket.onopen = () => {
        setStatus('open');
        // If a message was waiting for cold-start, send it now safely
        if (pendingMessageRef.current && socket.readyState === 1) {
          socket.send(JSON.stringify({ question: pendingMessageRef.current }));
          pendingMessageRef.current = null;
        }
      };

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'stream') {
          setIsGenerating(true);
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === 'assistant') {
              last.content = data.partial;
            }
            return updated;
          });
        } else if (data.type === 'response') {
          setIsGenerating(false);
          // SAVE TO MEMORY: Save AI's final answer to DB
          if (activeConvIdRef.current) {
            await supabase.from('messages').insert([{
              conversation_id: activeConvIdRef.current,
              role: 'assistant',
              content: data.answer,
              sources: data.sources
            }]);
          }
        }
      };

      socket.onclose = () => {
        setStatus('connecting');
        setTimeout(connectWS, 3000); 
      };
    };

    connectWS();
    return () => { if (socketRef.current) socketRef.current.close(); };
  }, []);

  // 3. INTERACTION: Send message and manage history creation
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // A. Check Identity
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Login to save history");

    let currentId = activeConvIdRef.current;

    // B. Create Conversation if New
    if (!currentId) {
      const { data: conv } = await supabase
        .from('conversations')
        .insert([{ user_id: user.id, title: text.substring(0, 30) }])
        .select().single();
      
      if (conv) {
        currentId = conv.id;
        activeConvIdRef.current = conv.id;
        // Silent URL change to keep WebSocket alive
        window.history.replaceState(null, '', `/chat/${conv.id}`);
      }
    }

    // C. Save User Question to DB
    await supabase.from('messages').insert([{ conversation_id: currentId, role: 'user', content: text }]);

    // D. Update UI
    setMessages((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: '' }]);
    setIsGenerating(true);

    // E. SAFE SEND: Check state before sending to avoid InvalidStateError
    if (socketRef.current && socketRef.current.readyState === 1) {
      socketRef.current.send(JSON.stringify({ question: text }));
    } else {
      pendingMessageRef.current = text;
    }
  };

  return { messages, sendMessage, isGenerating, backendStatus };
}