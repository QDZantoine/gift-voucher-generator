import { NextRequest, NextResponse } from "next/server";
import { prismaBase } from "@/lib/prisma";
import { MenuTypeSchema } from "@/lib/types/menu-type";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/menu-types/[id] - Récupère un type de menu spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const db = prismaBase;
    const menuType = await db.menuType.findUnique({
      where: { id },
    });

    if (!menuType) {
      return NextResponse.json(
        { error: "Type de menu non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(menuType);
  } catch (error) {
    console.error("Erreur lors de la récupération du type de menu:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/menu-types/[id] - Met à jour un type de menu
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Valider les données
    const validatedData = MenuTypeSchema.partial().parse(body);

    const db = prismaBase;

    // Vérifier que le type de menu existe
    const existingMenuType = await db.menuType.findUnique({
      where: { id },
    });

    if (!existingMenuType) {
      return NextResponse.json(
        { error: "Type de menu non trouvé" },
        { status: 404 }
      );
    }

    // Si le nom est modifié, vérifier qu'il n'existe pas déjà
    if (validatedData.name && validatedData.name !== existingMenuType.name) {
      const menuWithSameName = await db.menuType.findUnique({
        where: { name: validatedData.name },
      });

      if (menuWithSameName) {
        return NextResponse.json(
          { error: "Un menu avec ce nom existe déjà" },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le type de menu
    const updatedMenuType = await db.menuType.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.description !== undefined && {
          description: validatedData.description,
        }),
        ...(validatedData.amount !== undefined && {
          amount: validatedData.amount,
        }),
        ...(validatedData.isActive !== undefined && {
          isActive: validatedData.isActive,
        }),
        ...(validatedData.templateId !== undefined && {
          templateId: validatedData.templateId || null,
        }),
      },
    });

    return NextResponse.json(updatedMenuType);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du type de menu:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/menu-types/[id] - Supprime un type de menu
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const db = prismaBase;

    // Vérifier que le type de menu existe
    const existingMenuType = await db.menuType.findUnique({
      where: { id },
    });

    if (!existingMenuType) {
      return NextResponse.json(
        { error: "Type de menu non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si des bons cadeaux utilisent ce type de menu (via la relation)
    const giftCardsUsingMenu = await prismaBase.giftCard.count({
      where: { menuTypeId: id },
    });

    if (giftCardsUsingMenu > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer ce type de menu car ${giftCardsUsingMenu} bon(s) cadeau(x) l'utilise(nt)`,
        },
        { status: 400 }
      );
    }

    // Supprimer le type de menu
    await db.menuType.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Type de menu supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du type de menu:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

