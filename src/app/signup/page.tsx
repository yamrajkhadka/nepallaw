"use client";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/chat/new`,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-[family-name:var(--font-geist-sans)]">
      <Link href="/" className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      
      <Card className="w-full max-w-md shadow-2xl border-slate-200">
        <CardHeader className="text-center">
          <div className="bg-blue-600 p-3 rounded-2xl w-fit mx-auto mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Create Account</CardTitle>
          <CardDescription>Join Nepal Law AI to save your legal research history</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full h-12 flex gap-3 text-white bg-slate-900 hover:bg-slate-800 font-bold rounded-xl transition-all active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 brightness-200" alt="google" />
            Sign up with Google
          </Button>
          <div className="mt-8 text-center text-xs text-slate-400 font-medium">
            Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}