import { NextRequest, NextResponse } from "next/server";
import { prismaBase } from "@/lib/prisma";
import { MenuTypeSchema } from "@/lib/types/menu-type";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/menu-types - Liste tous les types de menus
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
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;

    const where: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
      isActive?: boolean;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActive !== null && isActive !== undefined && isActive !== "") {
      where.isActive = isActive === "true";
    }

    // Utiliser prismaBase pour une connexion directe (évite les problèmes avec Accelerate)
    const db = prismaBase;

    const total = await db.menuType.count({ where });
    const menuTypes = await db.menuType.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      menuTypes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des types de menus:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// POST /api/menu-types - Crée un nouveau type de menu
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
    const validatedData = MenuTypeSchema.parse(body);

    // Utiliser prismaBase pour une connexion directe (évite les problèmes avec Accelerate)
    const db = prismaBase;

    // Vérifier si un menu avec le même nom existe déjà
    const existingMenu = await db.menuType.findUnique({
      where: { name: validatedData.name },
    });

    if (existingMenu) {
      return NextResponse.json(
        { error: "Un menu avec ce nom existe déjà" },
        { status: 400 }
      );
    }

    // Créer le type de menu
    const menuType = await db.menuType.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        amount: validatedData.amount,
        isActive: validatedData.isActive,
        templateId: validatedData.templateId || null,
      },
    });

    return NextResponse.json(menuType, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du type de menu:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
