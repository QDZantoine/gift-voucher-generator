import { NextRequest, NextResponse } from "next/server";
import { prismaBase } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { isDateInExclusionPeriod } from "@/lib/types/exclusion-period";

// GET /api/gift-cards/validate?code=XXX - Vérifie un bon cadeau
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Code requis" }, { status: 400 });
    }

    // Rechercher le bon cadeau
    // Utiliser prismaBase pour les requêtes avec includes (Accelerate peut avoir des problèmes)
    const giftCard = await prismaBase.giftCard.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        user: {
          select: {
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

    // Récupérer toutes les périodes d'exclusion
    const exclusionPeriods = await prismaBase.exclusionPeriod.findMany();

    // Vérifier la validité
    const now = new Date();
    const expiryDate = new Date(giftCard.expiryDate);

    const validation = {
      isValid: true,
      errors: [] as string[],
      warnings: [] as string[],
    };

    // 1. Vérifier si déjà utilisé
    if (giftCard.isUsed) {
      validation.isValid = false;
      validation.errors.push(
        `Ce bon a déjà été utilisé le ${new Date(
          giftCard.usedAt!
        ).toLocaleDateString("fr-FR")}`
      );
    }

    // 2. Vérifier si expiré
    if (expiryDate < now) {
      validation.isValid = false;
      validation.errors.push(
        `Ce bon a expiré le ${expiryDate.toLocaleDateString("fr-FR")}`
      );
    }

    // 3. Vérifier les périodes d'exclusion
    const exclusionCheck = isDateInExclusionPeriod(now, exclusionPeriods);
    if (exclusionCheck.isExcluded) {
      validation.isValid = false;
      validation.errors.push(
        `Ce bon n'est pas valide pendant la période "${
          exclusionCheck.period?.name
        }" (${new Date(exclusionCheck.period!.startDate).toLocaleDateString(
          "fr-FR"
        )} - ${new Date(exclusionCheck.period!.endDate).toLocaleDateString(
          "fr-FR"
        )})`
      );
    }

    // 4. Avertir si proche de l'expiration (moins de 30 jours)
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilExpiry > 0 && daysUntilExpiry <= 30) {
      validation.warnings.push(
        `Ce bon expire dans ${daysUntilExpiry} jour${
          daysUntilExpiry > 1 ? "s" : ""
        }`
      );
    }

    // Retourner l'objet giftCard avec la validation intégrée
    return NextResponse.json({
      id: giftCard.id,
      code: giftCard.code,
      productType: giftCard.menuType?.name || giftCard.productType,
      menuType: giftCard.menuType,
      numberOfPeople: giftCard.numberOfPeople,
      recipientName: giftCard.recipientName,
      amount: giftCard.amount,
      expiryDate: giftCard.expiryDate.toISOString(),
      isUsed: giftCard.isUsed,
      isExpired: expiryDate < now,
      validation,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du bon:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Détails de l'erreur:", { errorMessage, errorStack });
    return NextResponse.json(
      { 
        error: "Erreur serveur",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
