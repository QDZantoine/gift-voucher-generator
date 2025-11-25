"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GiftCardWithUser, getGiftCardStatus } from "@/lib/types/gift-card";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { GiftCardDetailsDialog } from "./gift-card-details-dialog";
import { EmailStatusBadge } from "./email-status-badge";

interface GiftCardTableProps {
  giftCards: GiftCardWithUser[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export function GiftCardTable({
  giftCards,
  loading,
  page,
  totalPages,
  onPageChange,
  onRefresh,
}: GiftCardTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedGiftCard, setSelectedGiftCard] =
    useState<GiftCardWithUser | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleValidate = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/gift-cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isUsed: true }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur");
      }

      toast.success("Bon cadeau validé avec succès");
      onRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la validation"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce bon cadeau ?")) {
      return;
    }

    setActionLoading(id);
    try {
      const response = await fetch(`/api/gift-cards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur");

      toast.success("Bon cadeau supprimé");
      onRefresh();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Code copié dans le presse-papiers");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error("Erreur lors de la copie");
    }
  };

  const getStatusBadge = (giftCard: GiftCardWithUser) => {
    const status = getGiftCardStatus(giftCard);
    const variants = {
      active: "default" as const,
      used: "secondary" as const,
      expired: "destructive" as const,
    };
    const labels = {
      active: "Actif",
      used: "Utilisé",
      expired: "Expiré",
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (giftCards.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucun bon cadeau trouvé
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Destinataire</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {giftCards.map((giftCard) => (
              <TableRow key={giftCard.id}>
                <TableCell className="font-mono font-medium">
                  <div className="flex items-center gap-2">
                    <span>{giftCard.code}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopyCode(giftCard.code)}
                      title="Copier le code"
                    >
                      {copiedCode === giftCard.code ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {giftCard.menuType?.name || giftCard.productType}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {giftCard.numberOfPeople} pers.
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{giftCard.recipientName}</span>
                    <span className="text-sm text-muted-foreground">
                      {giftCard.purchaserEmail}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {giftCard.amount.toFixed(2)} €
                </TableCell>
                <TableCell>
                  {format(new Date(giftCard.expiryDate), "dd MMM yyyy", {
                    locale: fr,
                  })}
                </TableCell>
                <TableCell>{getStatusBadge(giftCard)}</TableCell>
                <TableCell>
                  <EmailStatusBadge
                    emailSent={giftCard.emailSent}
                    recipientEmail={giftCard.purchaserEmail}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={actionLoading === giftCard.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedGiftCard(giftCard);
                          setDetailsOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      {!giftCard.isUsed &&
                        new Date(giftCard.expiryDate) >= new Date() && (
                          <DropdownMenuItem
                            onClick={() => handleValidate(giftCard.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Valider
                          </DropdownMenuItem>
                        )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(giftCard.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}

      <GiftCardDetailsDialog
        giftCard={selectedGiftCard}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
