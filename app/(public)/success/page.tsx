"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Mail, Home, Loader2 } from "lucide-react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{
    id: string;
    amount_total: number;
    customer_details: {
      name: string;
      email: string;
    };
    metadata: {
      menuType: string;
      numberOfPeople: string;
      recipientName: string;
      recipientEmail: string;
      purchaserName?: string;
      purchaserEmail?: string;
      amount?: string;
    };
    payment_intent?: string;
  } | null>(null);

  useEffect(() => {
    if (sessionId) {
      // Récupérer les détails de la session
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then(
          (data: {
            id: string;
            amount_total: number;
            customer_details: {
              name: string;
              email: string;
            };
            metadata: {
              menuType: string;
              numberOfPeople: string;
              recipientName: string;
              recipientEmail: string;
              purchaserName?: string;
              purchaserEmail?: string;
              amount?: string;
            };
            payment_intent?: string;
          }) => {
            setSession(data);
            // Créer le bon cadeau si le webhook n&apos;a pas fonctionné
            createGiftCardFromSession(data);
            setLoading(false);
          }
        )
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const createGiftCardFromSession = async (sessionData: {
    id: string;
    amount_total: number;
    customer_details: {
      name: string;
      email: string;
    };
    metadata: {
      menuType: string;
      numberOfPeople: string;
      recipientName: string;
      recipientEmail: string;
      purchaserName?: string;
      purchaserEmail?: string;
      amount?: string;
    };
    payment_intent?: string;
  }) => {
    if (!sessionData?.metadata) return;

    try {
      // Créer le bon cadeau via l&apos;API publique
      const response = await fetch("/api/gift-cards/create-from-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: sessionData.metadata.menuType,
          numberOfPeople: parseInt(sessionData.metadata.numberOfPeople),
          recipientName: sessionData.metadata.recipientName,
          recipientEmail: sessionData.metadata.recipientEmail,
          purchaserName: sessionData.metadata.purchaserName,
          purchaserEmail: sessionData.metadata.purchaserEmail,
          amount: parseFloat(sessionData.metadata.amount || "0"),
          stripePaymentId: sessionData.payment_intent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Erreur API:", result.error);
      }
    } catch (error) {
      console.error("Erreur lors de la création du bon cadeau:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="border-green-200">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-6">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Paiement réussi !
              </h1>
              <p className="text-lg text-gray-600">
                Votre bon cadeau a été créé avec succès
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <Mail className="h-5 w-5" />
                <p className="font-medium">
                  Un email de confirmation a été envoyé
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Le destinataire recevra le bon cadeau par email avec toutes les
                instructions pour l&apos;utiliser au restaurant.
              </p>
              {session?.metadata && (
                <div className="text-sm text-gray-700 space-y-1 pt-3">
                  <p>
                    <strong>Menu :</strong> {session.metadata.menuType}
                  </p>
                  <p>
                    <strong>Nombre de personnes :</strong>{" "}
                    {session.metadata.numberOfPeople}
                  </p>
                  <p>
                    <strong>Destinataire :</strong>{" "}
                    {session.metadata.recipientName}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-sm text-gray-500">
                Vous recevrez également une copie de la confirmation à votre
                adresse email.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/order">
                <Button variant="outline" className="w-full sm:w-auto">
                  Commander un autre bon
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l&apos;accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
