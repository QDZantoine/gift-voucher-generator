import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGiftCardSchema } from "@/lib/validations/gift-card";
import { generateUniqueCode } from "@/lib/utils/code-generator";
import { headers } from "next/headers";

// GET /api/gift-cards - Liste tous les bons cadeaux
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer les paramètres de recherche
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status"); // active, used, expired
    const search = searchParams.get("search"); // Recherche par code ou email
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: {
      isUsed?: boolean;
      expiryDate?: { lt: Date } | { gte: Date };
      OR?: Array<{
        code?: { contains: string; mode: "insensitive" };
        recipientName?: { contains: string; mode: "insensitive" };
        recipientEmail?: { contains: string; mode: "insensitive" };
        purchaserEmail?: { contains: string; mode: "insensitive" };
      }>;
      productType?: string;
      createdOnline?: boolean;
    } = {};

    // Filtre par statut
    if (status === "used") {
      where.isUsed = true;
    } else if (status === "expired") {
      where.isUsed = false;
      where.expiryDate = { lt: new Date() };
    } else if (status === "active") {
      where.isUsed = false;
      where.expiryDate = { gte: new Date() };
    }

    // Recherche par code ou email
    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { recipientEmail: { contains: search, mode: "insensitive" } },
        { purchaserEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    // Récupérer les bons avec pagination
    const [giftCards, total] = await Promise.all([
      prisma.giftCard.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.giftCard.count({ where }),
    ]);

    return NextResponse.json({
      giftCards,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching gift cards:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des bons cadeaux" },
      { status: 500 }
    );
  }
}

// POST /api/gift-cards - Créer un nouveau bon cadeau
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Parser et valider les données
    const body = await request.json();
    const validatedData = createGiftCardSchema.parse(body);

    // Générer un code unique
    const code = await generateUniqueCode(async (code) => {
      const existing = await prisma.giftCard.findUnique({
        where: { code },
      });
      return !!existing;
    });

    // Créer le bon cadeau
    const giftCard = await prisma.giftCard.create({
      data: {
        code,
        productType: validatedData.productType,
        numberOfPeople: validatedData.numberOfPeople,
        recipientName: validatedData.recipientName,
        recipientEmail: validatedData.recipientEmail,
        purchaserName: validatedData.purchaserName,
        purchaserEmail: validatedData.purchaserEmail,
        amount: validatedData.amount,
        expiryDate: validatedData.expiryDate,
        createdOnline: validatedData.createdOnline,
        createdBy: validatedData.createdOnline ? null : session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(giftCard, { status: 201 });
  } catch (error) {
    console.error("Error creating gift card:", error);

    if (error instanceof Error && "issues" in error) {
      // Erreur de validation Zod
      return NextResponse.json(
        { error: "Données invalides", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la création du bon cadeau" },
      { status: 500 }
    );
  }
}
