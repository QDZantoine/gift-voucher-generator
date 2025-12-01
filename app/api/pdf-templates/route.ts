import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/pdf-templates - Récupérer tous les templates
export async function GET() {
  try {
    const db = getPrismaClient();
    const templates = await db.pDFTemplate.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: {
            menuTypes: true,
            giftCards: true,
          },
        },
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST /api/pdf-templates - Créer un nouveau template
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, productType, html, css, isActive } = body;

    if (!name || !productType || !html || !css) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = getPrismaClient();
    const template = await db.pDFTemplate.create({
      data: {
        name,
        description,
        productType,
        html,
        css,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}


