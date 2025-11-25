import { NextResponse } from "next/server";
import { prismaBase } from "@/lib/prisma";
import {
  sendEmailWithRetry,
  generateGiftCardEmailHTML,
  EmailData,
} from "@/lib/email";
import { generateGiftCardPDF } from "@/lib/pdf-generator";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support pour les deux formats : avec giftCardId ou avec données directes
    let giftCard: {
      code: string;
      productType: string;
      numberOfPeople: number;
      recipientName: string;
      purchaserName: string;
      purchaserEmail: string;
      amount: number;
      expiryDate: Date;
      purchaseDate: Date;
      customMessage?: string | null;
      templateId?: string | null;
      id?: string;
    };

    if (body.giftCardId) {
      // Récupérer le bon cadeau depuis la base de données avec le MenuType pour avoir le templateId
      const giftCardWithMenuType = await prismaBase.giftCard.findUnique({
        where: { id: body.giftCardId },
        include: {
          menuType: {
            select: {
              templateId: true,
            },
          },
        },
      });

      if (!giftCardWithMenuType) {
        return NextResponse.json(
          { error: "Bon cadeau non trouvé" },
          { status: 404 }
        );
      }
      
      // Si le giftCard n'a pas de templateId mais que le MenuType en a un, l'utiliser
      const templateId = giftCardWithMenuType.templateId || giftCardWithMenuType.menuType?.templateId || null;
      
      giftCard = {
        ...giftCardWithMenuType,
        templateId,
      };
    } else {
      // Utiliser les données fournies directement (pour les tests)
      giftCard = {
        code: body.code,
        productType: body.productType,
        numberOfPeople: body.numberOfPeople,
        recipientName: body.recipientName,
        purchaserName: body.purchaserName,
        purchaserEmail: body.purchaserEmail,
        amount: body.amount,
        expiryDate: new Date(body.expiryDate),
        purchaseDate: new Date(body.purchaseDate),
        customMessage: body.customMessage,
        templateId: body.templateId,
      };
    }

    // Générer le PDF avec le nouveau système
    const pdfBuffer = await generateGiftCardPDF({
      code: giftCard.code,
      productType: giftCard.productType,
      numberOfPeople: giftCard.numberOfPeople,
      recipientName: giftCard.recipientName,
      amount: giftCard.amount,
      expiryDate: giftCard.expiryDate.toISOString(),
      purchaseDate: giftCard.purchaseDate.toISOString(),
      customMessage: giftCard.customMessage || undefined,
      templateId: giftCard.templateId || undefined,
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
      customMessage: giftCard.customMessage || undefined,
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
        "X-Gift-Card-ID": giftCard.id || "unknown",
        "X-Product-Type": giftCard.productType,
      },
    };

    // Envoyer l'email avec retry logic
    const emailResult = await sendEmailWithRetry(emailData, 3);

    if (!emailResult.success) {
      console.error("Échec de l'envoi d'email:", emailResult.error);
      return NextResponse.json(
        {
          error: "Erreur lors de l'envoi de l'email",
          details: emailResult.error,
          retryCount: emailResult.retryCount,
        },
        { status: 500 }
      );
    }

    // Marquer l'email comme envoyé dans la base de données (si c'est un vrai bon cadeau)
    if (body.giftCardId) {
      await prismaBase.giftCard.update({
        where: { id: body.giftCardId },
        data: { emailSent: true },
      });
    }

    console.log(
      `✅ Email envoyé avec succès pour le bon cadeau ${giftCard.code}`,
      {
        emailId: emailResult.emailId,
        retryCount: emailResult.retryCount,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Email envoyé avec succès",
      giftCardCode: giftCard.code,
      recipientEmail: giftCard.purchaserEmail,
      emailId: emailResult.emailId,
      retryCount: emailResult.retryCount,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email", details: errorMessage },
      { status: 500 }
    );
  }
}
