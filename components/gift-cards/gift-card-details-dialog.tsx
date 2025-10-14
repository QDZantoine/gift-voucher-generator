"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GiftCardWithUser, getGiftCardStatus } from "@/lib/types/gift-card";
import { Calendar, CreditCard, User, Mail, Users, Tag } from "lucide-react";

interface GiftCardDetailsDialogProps {
  giftCard: GiftCardWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GiftCardDetailsDialog({
  giftCard,
  open,
  onOpenChange,
}: GiftCardDetailsDialogProps) {
  if (!giftCard) return null;

  const status = getGiftCardStatus(giftCard);
  const statusConfig = {
    active: { label: "Actif", variant: "default" as const },
    used: { label: "Utilisé", variant: "secondary" as const },
    expired: { label: "Expiré", variant: "destructive" as const },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Détails du bon cadeau
            <Badge variant={statusConfig[status].variant}>
              {statusConfig[status].label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Code :{" "}
            <span className="font-mono font-semibold">{giftCard.code}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du produit */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              INFORMATIONS DU BON
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
                    {giftCard.amount.toFixed(2)} €
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

          <Separator />

          {/* Acheteur */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              ACHETEUR
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Nom</p>
                  <p className="text-sm text-muted-foreground">
                    {giftCard.purchaserName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {giftCard.purchaserEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations système */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              INFORMATIONS SYSTÈME
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="font-medium">Date d&apos;achat</p>
                <p className="text-muted-foreground">
                  {format(
                    new Date(giftCard.purchaseDate),
                    "dd MMMM yyyy à HH:mm",
                    {
                      locale: fr,
                    }
                  )}
                </p>
              </div>

              {giftCard.isUsed && giftCard.usedAt && (
                <div>
                  <p className="font-medium">Date d&apos;utilisation</p>
                  <p className="text-muted-foreground">
                    {format(new Date(giftCard.usedAt), "dd MMMM yyyy à HH:mm", {
                      locale: fr,
                    })}
                  </p>
                </div>
              )}

              <div>
                <p className="font-medium">Origine</p>
                <p className="text-muted-foreground">
                  {giftCard.createdOnline
                    ? "Achat en ligne"
                    : "Créé au restaurant"}
                </p>
              </div>

              {giftCard.user && (
                <div>
                  <p className="font-medium">Créé par</p>
                  <p className="text-muted-foreground">
                    {giftCard.user.name || giftCard.user.email}
                  </p>
                </div>
              )}

              {giftCard.stripePaymentId && (
                <div>
                  <p className="font-medium">ID Paiement Stripe</p>
                  <p className="text-muted-foreground font-mono text-xs">
                    {giftCard.stripePaymentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
