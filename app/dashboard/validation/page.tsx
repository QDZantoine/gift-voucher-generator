"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Fonction de recherche avec debounce
  const searchGiftCard = useCallback(async (searchCode: string) => {
    if (!searchCode.trim() || searchCode.length < 3) {
      setGiftCardData(null);
      return;
    }

    setLoading(true);
    setGiftCardData(null);

    try {
      const response = await fetch(
        `/api/gift-cards/validate?code=${encodeURIComponent(searchCode.trim())}`
      );
      const data = await response.json();

      if (response.ok) {
        setGiftCardData(data);
      } else {
        const errorData = data as { error?: string; details?: string };
        // Afficher une erreur seulement si c'est une erreur serveur (500) ou si le code est complet
        if (response.status === 500) {
          toast.error(errorData.error || "Erreur lors de la recherche");
          console.error("Erreur API:", errorData.details || errorData.error);
        } else if (response.status === 404 && searchCode.trim().length >= 8) {
          // Afficher l'erreur seulement si le code semble complet (au moins 8 caractères)
          toast.error("Bon cadeau non trouvé");
        }
        // Ne pas afficher d'erreur pour les codes non trouvés lors de la recherche dynamique
        // L'utilisateur tape encore, on attend qu'il termine
        setGiftCardData(null);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setGiftCardData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchGiftCard(code);
    }, 500); // Attendre 500ms après que l'utilisateur arrête de taper

    return () => clearTimeout(timeoutId);
  }, [code, searchGiftCard]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Veuillez entrer un code");
      return;
    }

    // Déclencher la recherche immédiatement
    await searchGiftCard(code);
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
          <CardTitle className="flex items-center gap-2">
            Rechercher un bon cadeau
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Entrez le code du bon (ex: INF-XXXX-XXXX)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono pr-10"
                disabled={loading}
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            <Button type="submit" disabled={loading || !code.trim()}>
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </form>
          {code.length > 0 && code.length < 3 && (
            <p className="text-sm text-muted-foreground mt-2">
              Tapez au moins 3 caractères pour rechercher automatiquement
            </p>
          )}
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
