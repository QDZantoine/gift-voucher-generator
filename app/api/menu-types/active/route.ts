import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu-types/active - Liste tous les types de menus actifs
export async function GET(request: NextRequest) {
  try {
    const db = (prisma as any).$client || (prisma as any).$base || prisma;
    const menuTypes = await db.menuType.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(menuTypes);
  } catch (error) {
    console.error("Erreur lors de la récupération des menus actifs:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

