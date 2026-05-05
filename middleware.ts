import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClientForMiddleware } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClientForMiddleware(request);
  const { pathname } = request.nextUrl;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname === "/admin-login") {
    if (user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/admin-login"],
};
