"use client";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  async function login(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!isSupabaseConfigured()) { setMessage("Connect Supabase in .env.local before signing in."); return; } setMessage("Signing in..."); const form = new FormData(event.currentTarget); const supabase = createClient(); const { error } = await supabase.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) }); if (error) setMessage(error.message); else window.location.href = "/admin"; }
  return <div className="flex min-h-screen items-center justify-center bg-[#080808] p-5"><div className="w-full max-w-md"><div className="mb-8 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold"><LockKeyhole size={20}/></span><h1 className="mt-5 font-display text-5xl">Studio access</h1><p className="mt-2 text-sm text-white/40">Manage albums, photographs, and featured work.</p></div><form onSubmit={login} className="glass rounded-2xl p-7"><label className="text-xs uppercase tracking-[.16em] text-white/45">Email<input className="field mt-2" required type="email" name="email" autoComplete="email"/></label><label className="mt-5 block text-xs uppercase tracking-[.16em] text-white/45">Password<input className="field mt-2" required type="password" name="password" autoComplete="current-password"/></label><button className="button-primary mt-6 w-full">Sign in <ArrowRight size={15}/></button><p className="mt-4 text-center text-xs text-gold">{message}</p></form></div></div>;
}
