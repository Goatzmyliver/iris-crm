import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  const isAuthenticated = !!session

  // Define public routes that don't require authentication
  const isPublicRoute =
    req.nextUrl.pathname.startsWith("/auth") ||
    req.nextUrl.pathname === "/signin" ||
    req.nextUrl.pathname === "/signup" ||
    req.nextUrl.pathname === "/"

  // Redirect unauthenticated users to the sign-in page
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isPublicRoute && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

