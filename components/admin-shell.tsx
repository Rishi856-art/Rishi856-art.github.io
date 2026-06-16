"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(
  () => import("./admin-dashboard").then((module) => module.AdminDashboard),
  {
    ssr: false,
    loading: () => <div className="flex min-h-screen items-center justify-center text-sm text-white/40">Loading studio...</div>,
  },
);

export function AdminShell() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <div className="flex min-h-screen items-center justify-center p-5"><div className="glass max-w-lg rounded-2xl p-8 text-center"><p className="eyebrow">Setup required</p><h1 className="mt-4 font-display text-5xl">Connect your CMS</h1><p className="mt-4 text-sm leading-7 text-white/45">Add the Supabase URL and anon key from <code>.env.example</code> to <code>.env.local</code>, run the supplied schema, then reload this page.</p></div></div>;
  }
  return <Dashboard />;
}
