import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft, Home } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="border-orange-200">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-orange-100 p-6">
                <XCircle className="h-16 w-16 text-orange-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Paiement annulé
              </h1>
              <p className="text-lg text-gray-600">
                Votre commande n&apos;a pas été finalisée
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <p className="text-gray-700">
                Vous avez annulé le processus de paiement. Aucun montant
                n&apos;a été débité de votre compte.
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-sm text-gray-500">
                Si vous avez rencontré un problème ou avez des questions,
                n&apos;hésitez pas à nous contacter.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/order">
                <Button className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Réessayer
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
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
