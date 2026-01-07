import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPrismaClient } from "@/lib/prisma";

const db = getPrismaClient();

// GET /api/users - Liste tous les utilisateurs (SUPER_ADMIN uniquement)
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer le rôle de l'utilisateur
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    // Vérifier que l'utilisateur est SUPER_ADMIN
    if (user?.role !== "SUPER_ADMIN" && user?.role !== "SUPER_AMDIN") {
      return NextResponse.json(
        { error: "Accès non autorisé - Réservé aux Super Administrateurs" },
        { status: 403 }
      );
    }

    // Récupérer tous les utilisateurs
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}








