import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/gift-cards/[id] - Récupérer un bon cadeau par ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const db = getPrismaClient();
    const giftCard = await db.giftCard.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        menuType: {
          select: {
            id: true,
            name: true,
            description: true,
            amount: true,
          },
        },
      },
    });

    if (!giftCard) {
      return NextResponse.json(
        { error: "Bon cadeau non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(giftCard);
  } catch (error) {
    console.error("Error fetching gift card:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du bon cadeau" },
      { status: 500 }
    );
  }
}

// PATCH /api/gift-cards/[id] - Marquer un bon comme utilisé
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { isUsed } = body;

    const db = getPrismaClient();

    // Vérifier que le bon existe
    const existingGiftCard = await db.giftCard.findUnique({
      where: { id: params.id },
    });

    if (!existingGiftCard) {
      return NextResponse.json(
        { error: "Bon cadeau non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que le bon n'est pas déjà utilisé
    if (existingGiftCard.isUsed && isUsed) {
      return NextResponse.json(
        { error: "Ce bon a déjà été utilisé" },
        { status: 400 }
      );
    }

    // Vérifier que le bon n'est pas expiré
    if (new Date(existingGiftCard.expiryDate) < new Date()) {
      return NextResponse.json({ error: "Ce bon est expiré" }, { status: 400 });
    }

    // Mettre à jour le bon
    const giftCard = await db.giftCard.update({
      where: { id: params.id },
      data: {
        isUsed,
        usedAt: isUsed ? new Date() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        menuType: {
          select: {
            id: true,
            name: true,
            description: true,
            amount: true,
          },
        },
      },
    });

    return NextResponse.json(giftCard);
  } catch (error) {
    console.error("Error updating gift card:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du bon cadeau" },
      { status: 500 }
    );
  }
}

// DELETE /api/gift-cards/[id] - Supprimer un bon cadeau
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const db = getPrismaClient();
    await db.giftCard.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gift card:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du bon cadeau" },
      { status: 500 }
    );
  }
}

