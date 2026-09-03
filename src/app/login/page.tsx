"use client";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scale } from "lucide-react";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This forces Google to show the "Choose an account" screen
        queryParams: {
          prompt: 'select_account',
        },
        redirectTo: `${window.location.origin}/chat/new`,
      },
    });

    if (error) console.error("Login Error:", error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-[family-name:var(--font-geist-sans)]">
      <Card className="w-full max-w-md shadow-2xl border-slate-200">
        <CardHeader className="text-center">
          <div className="bg-slate-900 p-3 rounded-2xl w-fit mx-auto mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Nepal Law AI</CardTitle>
          <CardDescription>Official Identity & Legal Memory Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGoogleLogin} 
            variant="outline" 
            className="w-full h-12 flex gap-3 text-slate-700 font-bold border-slate-200 hover:bg-slate-50 shadow-sm transition-all active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" />
            Continue with Google
          </Button>
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
             <span className="text-[10px] uppercase font-bold tracking-widest">Authenticated via Supabase</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}