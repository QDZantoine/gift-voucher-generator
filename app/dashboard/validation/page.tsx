"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { GiftCardValidationCard } from "@/components/validation/gift-card-validation-card";

export default function ValidationPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [giftCardData, setGiftCardData] = useState<{
    id: string;
    code: string;
    productType: string;
    numberOfPeople: number;
    recipientName: string;
    recipientEmail: string;
    amount: number;
    expiryDate: string;
    isUsed: boolean;
    isExpired: boolean;
    validation?: {
      isValid: boolean;
      errors: string[];
      warnings: string[];
    };
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Veuillez entrer un code");
      return;
    }

    setLoading(true);
    setGiftCardData(null);

    try {
      const response = await fetch(
        `/api/gift-cards/validate?code=${encodeURIComponent(code.trim())}`
      );
      const data = await response.json();

      if (response.ok) {
        setGiftCardData(data);
      } else {
        toast.error(data.error || "Bon cadeau non trouvé");
      }
    } catch (error) {
      toast.error("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  const handleValidationSuccess = () => {
    setCode("");
    setGiftCardData(null);
    toast.success("Bon cadeau validé avec succès !");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Validation de Bons Cadeaux</h1>
          <p className="text-muted-foreground">
            Recherchez et validez les bons cadeaux au restaurant
          </p>
        </div>
        <Link href="/dashboard/validation/history">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Historique
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rechercher un bon cadeau</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Entrez le code du bon (ex: INF-XXXX-XXXX)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {giftCardData && (
        <GiftCardValidationCard
          giftCard={giftCardData}
          validationStatus={
            giftCardData.validation || {
              isValid: false,
              errors: [],
              warnings: [],
            }
          }
          onValidationSuccess={handleValidationSuccess}
        />
      )}
    </div>
  );
}
