import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClientForMiddleware } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClientForMiddleware(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If trying to access admin routes without authentication
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip middleware completely for login page
    if (request.nextUrl.pathname === "/admin-login") {
      return response;
    }

    // If already logged in, redirect to admin dashboard
    if (user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Redirect to login if not authenticated
    if (!user) {
      const loginUrl = new URL("/admin-login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/admin-login"],
};
