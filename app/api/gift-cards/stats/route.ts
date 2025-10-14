import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/gift-cards/stats - Récupérer les statistiques des bons cadeaux
export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const now = new Date();

    // Récupérer les statistiques
    const [total, active, used, expired] = await Promise.all([
      // Total des bons
      prisma.giftCard.count(),

      // Bons actifs (non utilisés et non expirés)
      prisma.giftCard.count({
        where: {
          isUsed: false,
          expiryDate: { gte: now },
        },
      }),

      // Bons utilisés
      prisma.giftCard.count({
        where: { isUsed: true },
      }),

      // Bons expirés (non utilisés mais date dépassée)
      prisma.giftCard.count({
        where: {
          isUsed: false,
          expiryDate: { lt: now },
        },
      }),
    ]);

    return NextResponse.json({
      total,
      active,
      used,
      expired,
    });
  } catch (error) {
    console.error("Error fetching gift card stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
