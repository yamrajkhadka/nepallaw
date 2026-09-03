"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, LogOut, Gavel, Loader2, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export function Sidebar() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  // Function to fetch history
  const fetchHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setHistory(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // 1. Check current session
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) fetchHistory(data.user.id);
      else setLoading(false);
    });

    // 2. Listen for Auth Changes (Google Login success)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        fetchHistory(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setHistory([]);
      }
    });

    // 3. Listen for new conversations being added to DB
    const channel = supabase.channel('sidebar-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversations' }, (payload) => {
        setHistory(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full font-[family-name:var(--font-geist-sans)]">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-6 font-bold text-slate-900 uppercase tracking-tighter">
          <div className="bg-blue-600 p-1 rounded-md text-white"><Gavel size={18} /></div>
          Nepal Law AI
        </div>
        <Button 
          onClick={() => router.push('/chat/new')}
          className="w-full justify-start gap-2 bg-white text-slate-900 border-slate-200 hover:bg-slate-100 shadow-sm transition-all active:scale-95" 
          variant="outline"
        >
          <Plus className="w-4 h-4 text-blue-600" /> New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">History</div>
        
        {loading ? (
          <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-300 w-4 h-4" /></div>
        ) : history.length === 0 ? (
          <p className="text-[11px] text-slate-400 px-3 py-2 italic text-center">No research saved</p>
        ) : history.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all cursor-pointer truncate ${
              id === chat.id ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100' : 'text-slate-600 hover:bg-slate-200'
            }`}>
              <MessageSquare className={`w-4 h-4 ${id === chat.id ? 'text-blue-600' : 'opacity-40'}`} />
              {chat.title}
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white/50">
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 text-sm">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>
    </div>
  );
}