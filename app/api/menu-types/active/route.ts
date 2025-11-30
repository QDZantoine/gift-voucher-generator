import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

// Configuration du cache pour cette route
export const revalidate = 60; // Revalider toutes les 60 secondes
export const dynamic = "force-static";

// GET /api/menu-types/active - Liste tous les types de menus actifs
export async function GET() {
  try {
    const db = getPrismaClient();
    const menuTypes = await db.menuType.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        amount: true,
        description: true,
        isActive: true,
      },
    });

    const response = NextResponse.json(menuTypes);

    // Headers de cache
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );

    return response;
  } catch (error) {
    console.error("Erreur lors de la récupération des menus actifs:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

