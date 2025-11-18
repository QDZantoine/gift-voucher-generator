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
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si c'est une route publique, laisser passer
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Vérifier l'authentification pour toutes les routes protégées
  const protectedRoutes = ["/dashboard", "/admin"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // BetterAuth stocke la session dans un cookie
    const sessionToken = request.cookies.get("better-auth.session_token");

    if (!sessionToken) {
      // Rediriger vers la page de connexion
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
