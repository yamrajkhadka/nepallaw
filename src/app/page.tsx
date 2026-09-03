"use client";

import { useState, useEffect } from 'react'; // Added useEffect
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Sparkles, Send, ArrowRight, Gavel, Search, Shield, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // FIX: Pre-warm the backend immediately when the user lands on the page
  useEffect(() => {
    // This starts the Hugging Face wake-up process (Cold Start)
    // so it's ready by the time the user finishes typing their question.
    fetch('https://yamraj047-gguf-with-rag.hf.space/').catch(() => {
      // We ignore errors here as we just want to trigger the wake-up
    });
  }, []);

  // Function to handle the search input and redirect to chat
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      router.push('/chat/new');
      return;
    };
    
    // Store the question so the chat page can read it immediately
    localStorage.setItem('initialQuery', query);
    router.push('/chat/new');
  };

  // Function for the sample question pills
  const handleSampleClick = (sampleText: string) => {
    localStorage.setItem('initialQuery', sampleText);
    router.push('/chat/new');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-[family-name:var(--font-geist-sans)]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Nepal Law <span className="text-blue-600">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">Login</Link>
          <Button onClick={() => router.push('/signup')} className="bg-slate-900 hover:bg-slate-800 rounded-full px-5 text-sm font-semibold text-white transition-all active:scale-95">
            Try Chatbot
          </Button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge variant="outline" className="py-1 px-4 text-blue-700 bg-blue-50 border-blue-100 rounded-full flex gap-2 items-center font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Advanced AI Legal Assistant for Nepal
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
            Ask anything about <br className="hidden md:block" /> 
            <span className="text-blue-600">Nepalese Law.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            A specialized chatbot that understands the Constitution, Penal Code, and Civil Code. 
            Instant answers with verified legal citations.
          </p>
          
          <div className="flex flex-col items-center gap-8">
            {/* Real Active Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative flex items-center bg-white border border-slate-200 p-2 rounded-2xl shadow-2xl">
                    <input 
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask about property rights, labor laws, or criminal code..."
                      className="flex-1 px-4 py-2 outline-none text-slate-700 bg-transparent placeholder:text-slate-400 font-medium"
                    />
                    <button type="submit" className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700 transition-all active:scale-90">
                        <Send className="w-5 h-5 text-white" />
                    </button>
                </div>
            </form>

            {/* Sample Query Pills */}
            <div className="flex flex-wrap justify-center gap-3">
               {[
                 "What is the penalty for theft?", 
                 "Rights of tenants in Nepal", 
                 "Divorce process in Civil Code"
               ].map((text) => (
                 <button 
                  key={text}
                  onClick={() => handleSampleClick(text)}
                  className="text-xs font-bold px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-all border border-slate-200/50"
                 >
                   "{text}"
                 </button>
               ))}
            </div>

            <div className="mt-4">
              <Button onClick={handleSearch} size="lg" className="h-14 px-12 bg-blue-600 hover:bg-blue-700 text-lg rounded-full shadow-2xl shadow-blue-200 transition-all hover:scale-105 active:scale-95 font-bold text-white">
                Start Chatting Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Icons */}
        <section className="bg-slate-50/50 py-20 px-6 border-y border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-1">Contextual RAG</h3>
                <p className="text-slate-500 text-sm">Searches 5,800+ legal provisions to find exact matches.</p>
            </div>
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-1">Citations Included</h3>
                <p className="text-slate-500 text-sm">Every AI response includes specific Law and Section titles.</p>
            </div>
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-1">Fine-tuned Model</h3>
                <p className="text-slate-500 text-sm">Trained specifically on the Nepalese legal framework.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 px-6 border-t border-slate-50 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold tracking-widest uppercase">© 2024 Nepal Law AI Bot</span>
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
                <Link href="#" className="hover:text-blue-600 transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-blue-600 transition-colors">Terms</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}