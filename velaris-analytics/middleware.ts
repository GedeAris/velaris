import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionCookieValue,
} from "@/lib/adminSession";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const secret =
    process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "";

  if (!secret) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const cookieValue = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const ok = cookieValue
    ? await verifyAdminSessionCookieValue(secret, cookieValue)
    : false;

  if (!ok) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

