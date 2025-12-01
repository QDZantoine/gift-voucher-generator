import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
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
      !purchaserName ||
      !purchaserEmail ||
      !amount
    ) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Vérifier si un bon cadeau avec ce payment_id existe déjà
    const db = getPrismaClient();
    if (stripePaymentId) {
      const existingGiftCard = await db.giftCard.findFirst({
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
    const code = generateGiftCardCode();

    // Trouver le MenuType correspondant
    const menuType = await db.menuType.findUnique({
      where: { name: productType },
    });

    if (!menuType) {
      return NextResponse.json(
        { error: `Type de menu "${productType}" non trouvé` },
        { status: 400 }
      );
    }

    // Calculer la date d'expiration (1 an)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Créer le bon cadeau avec la relation MenuType
    let giftCard = await db.giftCard.create({
      data: {
        code,
        productType, // Gardé pour rétrocompatibilité
        menuTypeId: menuType.id, // Nouvelle relation
        numberOfPeople: parseInt(numberOfPeople),
        recipientName: recipientName || "Destinataire",
        purchaserName: purchaserName || "Acheteur en ligne",
        purchaserEmail: purchaserEmail,
        amount: parseFloat(amount),
        purchaseDate: new Date(),
        expiryDate,
        isUsed: false,
        createdOnline: true,
        stripePaymentId: stripePaymentId || null,
        customMessage: body.customMessage || null,
        templateId: menuType.templateId || null, // Utiliser le template du MenuType
      },
    });

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
        customMessage: giftCard.customMessage || undefined,
        templateId: giftCard.templateId || undefined, // Utiliser le template du MenuType
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
      // Envoyer uniquement à l'acheteur
      const emailData: EmailData = {
        to: giftCard.purchaserEmail,
        subject: `🎁 Votre bon cadeau Restaurant Influences - ${giftCard.code}`,
        html: emailHTML,
        text: `Bonjour ${
          giftCard.purchaserName
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
        ],
        headers: {
          "X-Gift-Card-ID": giftCard.id,
          "X-Product-Type": giftCard.productType,
          "X-Payment-ID": stripePaymentId || "unknown",
        },
      };

      // Envoyer l'email à l'acheteur avec retry logic
      console.log(
        `📧 [Create Gift Card] Tentative d'envoi d'email pour bon cadeau ${giftCard.code}`
      );
      console.log(`   Destinataire: ${giftCard.purchaserEmail}`);

      const emailResult = await sendEmailWithRetry(emailData, 3);

      let emailSent = false;
      if (emailResult.success) {
        emailSent = true;
        console.log(
          `✅ [Create Gift Card] Email envoyé avec succès! ID: ${emailResult.emailId}`
        );
      } else {
        console.error(
          "❌ [Create Gift Card] Échec de l'envoi d'email:",
          emailResult.error,
          `Retry count: ${emailResult.retryCount}`
        );
      }

      // Marquer l'email comme envoyé ou non
      await db.giftCard.update({
        where: { id: giftCard.id },
        data: { emailSent },
      });
      giftCard = { ...giftCard, emailSent } as typeof giftCard;
    } catch (emailError) {
      console.error("❌ Erreur lors de l'envoi de l'email:", emailError);
      // Marquer l'email comme non envoyé
      await db.giftCard.update({
        where: { id: giftCard.id },
        data: { emailSent: false },
      });
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
