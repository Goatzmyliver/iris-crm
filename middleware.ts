import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is signed in and the current path is /login or /register, redirect to /dashboard
  if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If user is not signed in and the current path is not /login or /register, redirect to /login
  if (
    !session &&
    !req.nextUrl.pathname.startsWith("/login") &&
    !req.nextUrl.pathname.startsWith("/register") &&
    !req.nextUrl.pathname.startsWith("/_next") &&
    !req.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

