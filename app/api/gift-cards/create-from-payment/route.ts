import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateGiftCardCode } from "@/lib/utils/code-generator";
import {
  sendEmailWithRetry,
  generateGiftCardEmailHTML,
  EmailData,
} from "@/lib/email";
import { generateGiftCardPDF } from "@/lib/pdf-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productType,
      numberOfPeople,
      recipientName,
      recipientEmail,
      purchaserName,
      purchaserEmail,
      amount,
      stripePaymentId,
    } = body;

    // Validation des données requises
    if (
      !productType ||
      !numberOfPeople ||
      !recipientName ||
      !recipientEmail ||
      !amount
    ) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Vérifier si un bon cadeau avec ce payment_id existe déjà
    if (stripePaymentId) {
      const existingGiftCard = await prisma.giftCard.findFirst({
        where: { stripePaymentId },
      });

      if (existingGiftCard) {
        return NextResponse.json(
          {
            message: "Bon cadeau déjà créé",
            giftCard: existingGiftCard,
          },
          { status: 200 }
        );
      }
    }

    // Générer un code unique
    const code = await generateGiftCardCode();

    // Calculer la date d'expiration (1 an)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Créer le bon cadeau
    const giftCard = await prisma.giftCard.create({
      data: {
        code,
        productType,
        numberOfPeople: parseInt(numberOfPeople),
        recipientName,
        recipientEmail,
        purchaserName: purchaserName || null,
        purchaserEmail: purchaserEmail || null,
        amount: parseFloat(amount),
        purchaseDate: new Date(),
        expiryDate,
        isUsed: false,
        createdOnline: true,
        stripePaymentId: stripePaymentId || null,
        customMessage: body.customMessage || null,
        templateId: body.templateId || null,
      },
    });

    console.log("Bon cadeau créé depuis le paiement:", giftCard.code);

    // Envoyer l'email avec le PDF du bon cadeau
    try {
      // Générer le PDF
      const pdfBuffer = await generateGiftCardPDF({
        code: giftCard.code,
        productType: giftCard.productType,
        numberOfPeople: giftCard.numberOfPeople,
        recipientName: giftCard.recipientName,
        amount: giftCard.amount,
        expiryDate: giftCard.expiryDate.toISOString(),
        purchaseDate: giftCard.purchaseDate.toISOString(),
      });

      // Générer le HTML de l'email
      const emailHTML = generateGiftCardEmailHTML({
        code: giftCard.code,
        productType: giftCard.productType,
        numberOfPeople: giftCard.numberOfPeople,
        recipientName: giftCard.recipientName,
        amount: giftCard.amount,
        expiryDate: giftCard.expiryDate.toISOString(),
        purchaseDate: giftCard.purchaseDate.toISOString(),
      });

      // Préparer les données d'email avec bonnes pratiques
      const emailData: EmailData = {
        to: giftCard.recipientEmail,
        subject: `🎁 Votre bon cadeau Restaurant Influences - ${giftCard.code}`,
        html: emailHTML,
        text: `Bonjour ${
          giftCard.recipientName
        },\n\nVotre bon cadeau Restaurant Influences est prêt !\n\nCode: ${
          giftCard.code
        }\nMontant: ${giftCard.amount.toFixed(2)} €\nMenu: ${
          giftCard.productType
        }\nPersonnes: ${
          giftCard.numberOfPeople
        }\n\nLe PDF est joint à cet email.\n\nRestaurant Influences\n19 Rue Vieille Boucherie, 64100 Bayonne\n05 59 01 75 04`,
        attachments: [
          {
            filename: `bon-cadeau-${giftCard.code}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
        tags: [
          { name: "gift_card_code", value: giftCard.code },
          { name: "product_type", value: giftCard.productType },
          { name: "amount", value: giftCard.amount.toString() },
          { name: "source", value: "payment_api" },
        ],
        headers: {
          "X-Gift-Card-ID": giftCard.id,
          "X-Product-Type": giftCard.productType,
          "X-Payment-ID": stripePaymentId || "unknown",
        },
      };

      // Envoyer l'email avec retry logic
      const emailResult = await sendEmailWithRetry(emailData, 3);

      if (emailResult.success) {
        // Marquer l'email comme envoyé
        await prisma.giftCard.update({
          where: { id: giftCard.id },
          data: { emailSent: true },
        });

        console.log(
          `✅ Email envoyé avec succès pour le bon cadeau ${giftCard.code}`,
          {
            emailId: emailResult.emailId,
            retryCount: emailResult.retryCount,
          }
        );
      } else {
        console.error("Échec de l'envoi d'email:", emailResult.error);
        // L'email pourra être renvoyé manuellement depuis le dashboard
      }
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      // Ne pas faire échouer la création du bon cadeau si l'email échoue
    }

    return NextResponse.json({
      success: true,
      giftCard,
    });
  } catch (error) {
    console.error("Erreur lors de la création du bon cadeau:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du bon cadeau" },
      { status: 500 }
    );
  }
}
