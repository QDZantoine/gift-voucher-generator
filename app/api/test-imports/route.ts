import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🔧 Test des imports - Début");

    // Test 1: Import de Prisma
    console.log("🔧 Test 1: Import de Prisma...");
    try {
      const { prisma: _prisma } = await import("@/lib/prisma");
      console.log("✅ Prisma importé avec succès");
    } catch (error) {
      console.error("❌ Erreur import Prisma:", error);
      return NextResponse.json(
        { error: "Erreur import Prisma", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }

    // Test 2: Import du générateur de code
    console.log("🔧 Test 2: Import du générateur de code...");
    try {
      const { generateGiftCardCode } = await import(
        "@/lib/utils/code-generator"
      );
      const code = generateGiftCardCode();
      console.log("✅ Générateur de code OK:", code);
    } catch (error) {
      console.error("❌ Erreur générateur de code:", error);
      return NextResponse.json(
        { error: "Erreur générateur de code", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }

    // Test 3: Import des fonctions email
    console.log("🔧 Test 3: Import des fonctions email...");
    try {
      const { sendEmailWithRetry: _sendEmailWithRetry, generateGiftCardEmailHTML: _generateGiftCardEmailHTML } = await import(
        "@/lib/email"
      );
      console.log("✅ Fonctions email importées avec succès");
    } catch (error) {
      console.error("❌ Erreur import email:", error);
      return NextResponse.json(
        { error: "Erreur import email", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }

    // Test 4: Import du générateur PDF
    console.log("🔧 Test 4: Import du générateur PDF...");
    try {
      const { generateGiftCardPDF: _generateGiftCardPDF } = await import("@/lib/pdf-generator");
      console.log("✅ Générateur PDF importé avec succès");
    } catch (error) {
      console.error("❌ Erreur import PDF:", error);
      return NextResponse.json(
        { error: "Erreur import PDF", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tous les imports sont OK",
    });
  } catch (error) {
    console.error("❌ Erreur générale:", error);
    return NextResponse.json(
      { error: "Erreur générale", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

