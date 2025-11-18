"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Mail,
  Calendar,
  Users,
  CreditCard,
  Tag,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ValidationStatus {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface GiftCardValidationCardProps {
  giftCard: {
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
  };
  validationStatus: ValidationStatus;
  onValidationSuccess: () => void;
}

export function GiftCardValidationCard({
  giftCard,
  validationStatus,
  onValidationSuccess,
}: GiftCardValidationCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validating, setValidating] = useState(false);

  const handleValidate = async () => {
    setValidating(true);
    try {
      const response = await fetch(`/api/gift-cards/${giftCard.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isUsed: true }),
      });

      if (response.ok) {
        onValidationSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la validation");
      }
    } catch (error) {
      toast.error("Erreur lors de la validation");
    } finally {
      setValidating(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Card
        className={
          validationStatus.isValid ? "border-green-500" : "border-red-500"
        }
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {validationStatus.isValid ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  Bon cadeau valide
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  Bon cadeau invalide
                </>
              )}
            </CardTitle>
            <Badge
              variant={validationStatus.isValid ? "default" : "destructive"}
              className="text-lg px-4 py-1"
            >
              {giftCard.code}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Erreurs */}
          {validationStatus.errors.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validationStatus.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Avertissements */}
          {validationStatus.warnings.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validationStatus.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          {/* Informations du bon */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              DÉTAILS DU BON CADEAU
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Type de menu</p>
                  <p className="text-sm text-muted-foreground">
                    {giftCard.productType}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Nombre de personnes</p>
                  <p className="text-sm text-muted-foreground">
                    {giftCard.numberOfPeople} personne
                    {giftCard.numberOfPeople > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Montant</p>
                  <p className="text-sm text-muted-foreground">
                    {giftCard.amount ? giftCard.amount.toFixed(2) : "0.00"} €
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Date d&apos;expiration</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(giftCard.expiryDate), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Destinataire */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              DESTINATAIRE
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Nom</p>
                  <p className="text-sm text-muted-foreground">
                    {giftCard.recipientName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {giftCard.recipientEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {validationStatus.isValid && (
            <>
              <Separator />
              <Button
                onClick={() => setConfirmOpen(true)}
                className="w-full"
                size="lg"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Valider ce bon cadeau
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la validation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir valider ce bon cadeau ?
              <br />
              <br />
              <strong>Code :</strong> {giftCard.code}
              <br />
              <strong>Montant :</strong>{" "}
              {giftCard.amount ? giftCard.amount.toFixed(2) : "0.00"} €
              <br />
              <strong>Destinataire :</strong> {giftCard.recipientName}
              <br />
              <br />
              Cette action marquera le bon comme utilisé et ne peut pas être
              annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={validating}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleValidate} disabled={validating}>
              {validating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validation...
                </>
              ) : (
                "Confirmer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
