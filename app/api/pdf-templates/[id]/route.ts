import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/pdf-templates/[id] - Récupérer un template
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getPrismaClient();
    
    const template = await db.pDFTemplate.findUnique({
      where: { id },
      include: {
        menuTypes: true,
        _count: {
          select: {
            giftCards: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

// PATCH /api/pdf-templates/[id] - Mettre à jour un template
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, productType, html, css, isActive } = body;

    const db = getPrismaClient();
    const template = await db.pDFTemplate.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(productType !== undefined && { productType }),
        ...(html !== undefined && { html }),
        ...(css !== undefined && { css }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}

// DELETE /api/pdf-templates/[id] - Supprimer un template
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = getPrismaClient();
    
    // Vérifier si le template est utilisé
    const template = await db.pDFTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            menuTypes: true,
            giftCards: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    if (template._count.menuTypes > 0 || template._count.giftCards > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete template: it is used by ${template._count.menuTypes} menu type(s) and ${template._count.giftCards} gift card(s)`,
        },
        { status: 400 }
      );
    }

    await db.pDFTemplate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}

