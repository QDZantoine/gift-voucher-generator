import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ExclusionPeriodSchema } from "@/lib/validations/exclusion-period";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/exclusion-periods - Liste toutes les périodes d'exclusion
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const isRecurring = searchParams.get("isRecurring");

    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
      isActive?: boolean;
      isRecurring?: boolean;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (
      isRecurring !== null &&
      isRecurring !== undefined &&
      isRecurring !== ""
    ) {
      where.isRecurring = isRecurring === "true";
    }

    // Compter le total
    const total = await prisma.exclusionPeriod.count({ where });

    // Récupérer les périodes
    const periods = await prisma.exclusionPeriod.findMany({
      where,
      orderBy: { startDate: "asc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      periods,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des périodes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/exclusion-periods - Crée une nouvelle période d'exclusion
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();

    // Valider les données
    const validatedData = ExclusionPeriodSchema.parse(body);

    // Vérifier les chevauchements
    const overlapping = await prisma.exclusionPeriod.findMany({
      where: {
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(validatedData.endDate) } },
              { endDate: { gte: new Date(validatedData.startDate) } },
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

    // Créer la période
    const period = await prisma.exclusionPeriod.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        isRecurring: validatedData.isRecurring,
      },
    });

    return NextResponse.json(period, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la période:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
