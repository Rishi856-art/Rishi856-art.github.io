import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, { cookies: { getAll: () => request.cookies.getAll(), setAll(cookies: { name: string; value: string; options: CookieOptions }[]) { cookies.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } });
  const { data: { user } } = await supabase.auth.getUser();
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login" && !user) { const login = request.nextUrl.clone(); login.pathname = "/admin/login"; return NextResponse.redirect(login); }
  if (request.nextUrl.pathname === "/admin/login" && user) { const dashboard = request.nextUrl.clone(); dashboard.pathname = "/admin"; return NextResponse.redirect(dashboard); }
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
