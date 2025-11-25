import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { UpdateExclusionPeriodSchema } from "@/lib/validations/exclusion-period";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/exclusion-periods/[id] - Récupère une période spécifique
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

    const db = getPrismaClient();
    const period = await db.exclusionPeriod.findUnique({
      where: { id },
    });

    if (!period) {
      return NextResponse.json(
        { error: "Période non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(period);
  } catch (error) {
    console.error("Erreur lors de la récupération de la période:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/exclusion-periods/[id] - Met à jour une période
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

    const db = getPrismaClient();
    const { id } = await params;
    const body = await request.json();

    // Valider les données
    const validatedData = UpdateExclusionPeriodSchema.parse(body);

    // Vérifier que la période existe
    const existingPeriod = await db.exclusionPeriod.findUnique({
      where: { id },
    });

    if (!existingPeriod) {
      return NextResponse.json(
        { error: "Période non trouvée" },
        { status: 404 }
      );
    }

    // Préparer les dates pour la vérification de chevauchement
    const startDate = validatedData.startDate
      ? new Date(validatedData.startDate)
      : existingPeriod.startDate;
    const endDate = validatedData.endDate
      ? new Date(validatedData.endDate)
      : existingPeriod.endDate;

    // Vérifier les chevauchements (exclure la période actuelle)
    const overlapping = await db.exclusionPeriod.findMany({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              {
                AND: [
                  { startDate: { lte: endDate } },
                  { endDate: { gte: startDate } },
                ],
              },
            ],
          },
        ],
      },
    });

    if (overlapping.length > 0) {
      return NextResponse.json(
        {
          error: "Cette période chevauche une période existante",
          overlappingPeriods: overlapping,
        },
        { status: 400 }
      );
    }

    // Mettre à jour la période
    const updatedPeriod = await db.exclusionPeriod.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.description !== undefined && {
          description: validatedData.description,
        }),
        ...(validatedData.startDate && {
          startDate: new Date(validatedData.startDate),
        }),
        ...(validatedData.endDate && {
          endDate: new Date(validatedData.endDate),
        }),
        ...(validatedData.isRecurring !== undefined && {
          isRecurring: validatedData.isRecurring,
        }),
        ...(validatedData.recurringType && {
          recurringType: validatedData.recurringType,
        }),
      },
    });

    return NextResponse.json(updatedPeriod);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la période:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/exclusion-periods/[id] - Supprime une période
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

    const db = getPrismaClient();
    const { id } = await params;

    // Vérifier que la période existe
    const existingPeriod = await db.exclusionPeriod.findUnique({
      where: { id },
    });

    if (!existingPeriod) {
      return NextResponse.json(
        { error: "Période non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer la période
    await db.exclusionPeriod.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Période supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la période:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

