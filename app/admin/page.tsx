import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";

export const metadata: Metadata = { title: "Studio Dashboard", robots: { index: false, follow: false } };
export default function AdminPage() { return <AdminShell/>; }
