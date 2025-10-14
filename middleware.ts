import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Routes publiques
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/api",
    "/success",
    "/cancel",
    "/admin",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si c'est une route publique, laisser passer
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Pour les routes protégées (/dashboard), vérifier le cookie de session
  if (pathname.startsWith("/dashboard")) {
    // BetterAuth stocke la session dans un cookie
    const sessionToken = request.cookies.get("better-auth.session_token");

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
