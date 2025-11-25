import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPrismaClient } from "@/lib/prisma";
import { generateGiftCardCode } from "@/lib/utils/code-generator";
import {
  sendEmailWithRetry,
  generateGiftCardEmailHTML,
  EmailData,
} from "@/lib/email";
import { generateGiftCardPDF } from "@/lib/pdf-generator";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Gérer l'événement de paiement réussi
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const metadata = session.metadata!;
      const {
        menuType,
        numberOfPeople,
        recipientName,
        purchaserName,
        purchaserEmail,
        amount,
      } = metadata;

      // Générer un code unique
      const code = await generateGiftCardCode();

      // Trouver le MenuType correspondant
      const db = getPrismaClient();
      const menuTypeData = await db.menuType.findUnique({
        where: { name: menuType },
      });

      if (!menuTypeData) {
        console.error(`MenuType "${menuType}" non trouvé lors de la création du bon cadeau`);
        // On continue quand même avec productType pour ne pas bloquer le webhook
      }

      // Calculer la date d'expiration (1 an)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      // Créer le bon cadeau avec la relation MenuType
      // Utiliser le templateId du MenuType si disponible, sinon celui des metadata
      const giftCard = await db.giftCard.create({
        data: {
          code,
          productType: menuType, // Gardé pour rétrocompatibilité
          menuTypeId: menuTypeData?.id || null, // Nouvelle relation
          numberOfPeople: parseInt(numberOfPeople),
          recipientName: recipientName || "Destinataire",
          purchaserName: purchaserName || "Acheteur en ligne",
          purchaserEmail: purchaserEmail || session.customer_email || "",
          amount: parseFloat(amount),
          purchaseDate: new Date(),
          expiryDate,
          isUsed: false,
          createdOnline: true,
          stripePaymentId: session.payment_intent as string,
          customMessage: metadata.customMessage || null,
          templateId: menuTypeData?.templateId || metadata.templateId || null, // Priorité au template du MenuType
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
            { name: "source", value: "stripe_webhook" },
          ],
          headers: {
            "X-Gift-Card-ID": giftCard.id,
            "X-Product-Type": giftCard.productType,
            "X-Payment-ID": session.id,
          },
        };

        // Envoyer l'email à l'acheteur avec retry logic
        const emailResult = await sendEmailWithRetry(emailData, 3);

        let emailSent = false;
        if (!emailResult.success) {
          console.error(
            "Échec de l'envoi d'email à l'acheteur via webhook:",
            emailResult.error
          );
          // Ne pas faire échouer le webhook pour un problème d'email
          // L'email pourra être renvoyé manuellement depuis le dashboard
        } else {
          emailSent = true;
        }

        // Marquer l'email comme envoyé
        await db.giftCard.update({
          where: { id: giftCard.id },
          data: { emailSent },
        });
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
        // Ne pas faire échouer le webhook si l'email échoue
        // L'email pourra être renvoyé manuellement depuis le dashboard
      }

      return NextResponse.json({ received: true, giftCardCode: giftCard.code });
    } catch (error) {
      console.error("Erreur lors de la création du bon cadeau:", error);
      return NextResponse.json(
        { error: "Failed to create gift card" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
