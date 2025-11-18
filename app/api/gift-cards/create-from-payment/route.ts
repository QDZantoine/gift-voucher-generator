import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateGiftCardCode } from "@/lib/utils/code-generator";
import {
  sendEmailWithRetry,
  generateGiftCardEmailHTML,
  generatePurchaseConfirmationEmailHTML,
  EmailData,
} from "@/lib/email";
import { generateGiftCardPDF } from "@/lib/pdf-generator";

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Mode debug: Début de la création du bon cadeau");

    const body = await request.json();
    console.log("📋 Données reçues:", JSON.stringify(body, null, 2));

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
      console.log("❌ Données manquantes");
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    console.log("✅ Validation des données OK");

    // Vérifier si un bon cadeau avec ce payment_id existe déjà
    const db = (prisma as any).$client || (prisma as any).$base || prisma;
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
    console.log("🔧 Génération du code unique...");
    const code = generateGiftCardCode();
    console.log(`✅ Code généré: ${code}`);

    // Trouver le MenuType correspondant
    const menuType = await db.menuType.findUnique({
      where: { name: productType },
    });

    if (!menuType) {
      console.log(`❌ MenuType "${productType}" non trouvé`);
      return NextResponse.json(
        { error: `Type de menu "${productType}" non trouvé` },
        { status: 400 }
      );
    }

    // Calculer la date d'expiration (1 an)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    console.log(`✅ Date d'expiration: ${expiryDate.toISOString()}`);

    // Créer le bon cadeau avec la relation MenuType
    console.log("🔧 Création du bon cadeau en base de données...");
    let giftCard = await db.giftCard.create({
      data: {
        code,
        productType, // Gardé pour rétrocompatibilité
        menuTypeId: menuType.id, // Nouvelle relation
        numberOfPeople: parseInt(numberOfPeople),
        recipientName,
        recipientEmail,
        purchaserName: purchaserName || "Acheteur en ligne",
        purchaserEmail: purchaserEmail || recipientEmail,
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
      console.log("📧 Génération du PDF...");
      // Générer le PDF
      const pdfBuffer = await generateGiftCardPDF({
        code: giftCard.code,
        productType: giftCard.productType,
        numberOfPeople: giftCard.numberOfPeople,
        recipientName: giftCard.recipientName,
        amount: giftCard.amount,
        expiryDate: giftCard.expiryDate.toISOString(),
        purchaseDate: giftCard.purchaseDate.toISOString(),
        customMessage: giftCard.customMessage,
      });

      console.log("📧 Génération du HTML de l'email...");
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

      console.log("📧 Préparation des données d'email...");
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
        ],
        headers: {
          "X-Gift-Card-ID": giftCard.id,
          "X-Product-Type": giftCard.productType,
          "X-Payment-ID": stripePaymentId || "unknown",
        },
      };

      console.log("📧 Envoi de l'email au destinataire...");
      // Envoyer l'email au destinataire avec retry logic
      const recipientEmailResult = await sendEmailWithRetry(emailData, 3);

      let emailSent = false;
      if (recipientEmailResult.success) {
        emailSent = true;
        console.log(
          `✅ Email envoyé au destinataire pour le bon cadeau ${giftCard.code}`,
          {
            emailId: recipientEmailResult.emailId,
            retryCount: recipientEmailResult.retryCount,
          }
        );
      } else {
        console.error("❌ Échec de l'envoi d'email au destinataire:", recipientEmailResult.error);
      }

      // Envoyer l'email de confirmation à l'acheteur (toujours, même si c'est la même personne)
      const purchaserEmailToSend = purchaserEmail || recipientEmail;
      if (purchaserEmailToSend) {
        console.log("📧 Envoi de l'email de confirmation à l'acheteur...");
        const confirmationHTML = generatePurchaseConfirmationEmailHTML({
          purchaserName: purchaserName || "Acheteur",
          recipientName: giftCard.recipientName,
          recipientEmail: giftCard.recipientEmail,
          code: giftCard.code,
          productType: giftCard.productType,
          numberOfPeople: giftCard.numberOfPeople,
          amount: giftCard.amount,
          expiryDate: giftCard.expiryDate.toISOString(),
          purchaseDate: giftCard.purchaseDate.toISOString(),
          customMessage: giftCard.customMessage || undefined,
        });

        const confirmationEmailData: EmailData = {
          to: purchaserEmailToSend,
          subject: `✅ Confirmation de votre achat - Bon cadeau Restaurant Influences`,
          html: confirmationHTML,
          text: `Bonjour ${purchaserName || "Acheteur"},\n\nMerci pour votre achat !\n\nVotre bon cadeau a été créé avec succès et envoyé au destinataire.\n\nCode: ${giftCard.code}\nMontant: ${giftCard.amount.toFixed(2)} €\nMenu: ${giftCard.productType}\nPersonnes: ${giftCard.numberOfPeople}\n\nRestaurant Influences\n19 Rue Vieille Boucherie, 64100 Bayonne\n05 59 01 75 04`,
          tags: [
            { name: "gift_card_code", value: giftCard.code },
            { name: "product_type", value: giftCard.productType },
            { name: "amount", value: giftCard.amount.toString() },
            { name: "email_type", value: "purchase_confirmation" },
          ],
          headers: {
            "X-Gift-Card-ID": giftCard.id,
            "X-Product-Type": giftCard.productType,
            "X-Payment-ID": stripePaymentId || "unknown",
            "X-Email-Type": "purchase_confirmation",
          },
        };

        const confirmationEmailResult = await sendEmailWithRetry(confirmationEmailData, 3);
        if (confirmationEmailResult.success) {
          console.log(
            `✅ Email de confirmation envoyé à l'acheteur pour le bon cadeau ${giftCard.code}`,
            {
              emailId: confirmationEmailResult.emailId,
              retryCount: confirmationEmailResult.retryCount,
            }
          );
        } else {
          console.error("❌ Échec de l'envoi d'email de confirmation:", confirmationEmailResult.error);
        }
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
