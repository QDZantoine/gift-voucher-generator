import { NextRequest, NextResponse } from "next/server";
import { stripe, calculateGiftCardAmount, MenuType } from "@/lib/stripe";
import { z } from "zod";

const orderSchema = z.object({
  menuType: z.enum([
    "Menu Influences",
    "Menu Dégustation",
    "Menu Prestige",
    "Menu Découverte",
  ]),
  numberOfPeople: z.number().min(1).max(20),
  recipientName: z.string().min(2),
  recipientEmail: z.string().email(),
  purchaserName: z.string().min(2),
  purchaserEmail: z.string().email(),
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
    } = validatedData;

    // Calculer le montant total
    const amount = calculateGiftCardAmount(
      menuType as MenuType,
      numberOfPeople
    );

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
