import { NextRequest, NextResponse } from "next/server";
import { generateGiftCardPDF } from "@/lib/pdf-generator";

export async function POST(request: NextRequest) {
  try {
    const giftCardData = await request.json();

    // Validation des données requises
    if (
      !giftCardData.code ||
      !giftCardData.productType ||
      !giftCardData.numberOfPeople ||
      !giftCardData.recipientName ||
      !giftCardData.amount
    ) {
      return NextResponse.json(
        { error: "Données manquantes pour la génération du PDF" },
        { status: 400 }
      );
    }

    // Générer le PDF
    const pdfBuffer = await generateGiftCardPDF(giftCardData);

    // Retourner le PDF
    return new NextResponse(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="bon-cadeau-${giftCardData.code}.pdf"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 }
    );
  }
}
