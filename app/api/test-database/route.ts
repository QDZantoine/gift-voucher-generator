import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Test de la base de données - Début");

    // Test 1: Connexion à la base de données
    console.log("🔧 Test 1: Connexion à la base de données...");
    try {
      await prisma.$connect();
      console.log("✅ Connexion à la base de données OK");
    } catch (error) {
      console.error("❌ Erreur connexion DB:", error);
      return NextResponse.json(
        { error: "Erreur connexion DB", details: error.message },
        { status: 500 }
      );
    }

    // Test 2: Compter les bons cadeaux existants
    console.log("🔧 Test 2: Compter les bons cadeaux...");
    try {
      const count = await prisma.giftCard.count();
      console.log(`✅ Nombre de bons cadeaux: ${count}`);
    } catch (error) {
      console.error("❌ Erreur comptage:", error);
      return NextResponse.json(
        { error: "Erreur comptage", details: error.message },
        { status: 500 }
      );
    }

    // Test 3: Créer un bon cadeau de test
    console.log("🔧 Test 3: Création d'un bon cadeau de test...");
    try {
      const testGiftCard = await prisma.giftCard.create({
        data: {
          code: "TEST-DEBUG-001",
          productType: "Test",
          numberOfPeople: 1,
          recipientName: "Test User",
          recipientEmail: "test@example.com",
          amount: 50.0,
          purchaseDate: new Date(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
          isUsed: false,
          createdOnline: false,
          emailSent: false,
        },
      });
      console.log("✅ Bon cadeau de test créé:", testGiftCard.code);

      // Supprimer le bon cadeau de test
      await prisma.giftCard.delete({
        where: { id: testGiftCard.id },
      });
      console.log("✅ Bon cadeau de test supprimé");
    } catch (error) {
      console.error("❌ Erreur création bon cadeau:", error);
      return NextResponse.json(
        { error: "Erreur création bon cadeau", details: error.message },
        { status: 500 }
      );
    }

    // Test 4: Tester les MenuTypes
    console.log("🔧 Test 4: Test des MenuTypes...");
    try {
      const { prismaBase } = await import("@/lib/prisma");
      
      // Vérifier que prismaBase est disponible
      if (!prismaBase || !prismaBase.menuType) {
        console.error("❌ prismaBase.menuType non disponible");
        return NextResponse.json(
          { error: "prismaBase.menuType non disponible" },
          { status: 500 }
        );
      }

      // Compter les menu types
      const menuTypeCount = await prismaBase.menuType.count();
      console.log(`✅ Nombre de menu types: ${menuTypeCount}`);

      // Récupérer tous les menu types
      const menuTypes = await prismaBase.menuType.findMany({
        take: 5,
      });
      console.log(`✅ Menu types récupérés: ${menuTypes.length}`);
      if (menuTypes.length > 0) {
        console.log("   Exemples:", menuTypes.map(m => m.name).join(", "));
      }
    } catch (error) {
      console.error("❌ Erreur test MenuTypes:", error);
      return NextResponse.json(
        { 
          error: "Erreur test MenuTypes", 
          details: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Base de données OK",
    });
  } catch (error) {
    console.error("❌ Erreur générale:", error);
    return NextResponse.json(
      { error: "Erreur générale", details: error.message },
      { status: 500 }
    );
  }
}

