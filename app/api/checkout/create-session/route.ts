import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const orderSchema = z.object({
  menuType: z.string().min(1, "Le type de menu est requis"),
  numberOfPeople: z.number().min(1).max(20),
  recipientName: z.string().min(2),
  recipientEmail: z.string().email(),
  purchaserName: z.string().min(2),
  purchaserEmail: z.string().email(),
  customMessage: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Valider les données
    const validatedData = orderSchema.parse(body);

    const {
      menuType,
      numberOfPeople,
      recipientName,
      recipientEmail,
      purchaserName,
      purchaserEmail,
      customMessage,
    } = validatedData;

    // Vérifier que le type de menu existe et est actif
    const menuTypeData = await prisma.menuType.findUnique({
      where: { name: menuType },
    });

    if (!menuTypeData) {
      return NextResponse.json(
        { error: "Type de menu non trouvé" },
        { status: 400 }
      );
    }

    if (!menuTypeData.isActive) {
      return NextResponse.json(
        { error: "Ce type de menu n'est plus actif" },
        { status: 400 }
      );
    }

    // Calculer le montant total
    const amount = menuTypeData.amount * numberOfPeople;

    // Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Bon Cadeau - ${menuType}`,
              description: `Pour ${numberOfPeople} personne${
                numberOfPeople > 1 ? "s" : ""
              } au Restaurant Influences`,
              images: [
                `${process.env.NEXT_PUBLIC_APP_URL}/images/gift-card.jpg`,
              ],
            },
            unit_amount: amount * 100, // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      customer_email: purchaserEmail,
      metadata: {
        menuType,
        numberOfPeople: numberOfPeople.toString(),
        recipientName,
        recipientEmail,
        purchaserName,
        purchaserEmail,
        amount: amount.toString(),
        customMessage: customMessage || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}
