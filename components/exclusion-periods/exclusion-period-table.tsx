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
import { ExclusionPeriod } from "@/lib/types/exclusion-period";
import { MoreHorizontal, Pencil, Trash2, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
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

interface ExclusionPeriodTableProps {
  periods: ExclusionPeriod[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export function ExclusionPeriodTable({
  periods,
  loading,
  page,
  totalPages,
  onPageChange,
  onRefresh,
}: ExclusionPeriodTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [periodToDelete, setPeriodToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!periodToDelete) return;

    setActionLoading(periodToDelete);
    try {
      const response = await fetch(`/api/exclusion-periods/${periodToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Période supprimée avec succès");
        onRefresh();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la suppression");
      }
    } catch (_error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
      setPeriodToDelete(null);
    }
  };

  const isCurrentPeriod = (period: ExclusionPeriod) => {
    const now = new Date();
    return now >= new Date(period.startDate) && now <= new Date(period.endDate);
  };

  const isPastPeriod = (period: ExclusionPeriod) => {
    const now = new Date();
    return now > new Date(period.endDate) && !period.isRecurring;
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

  if (periods.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Aucune période d&apos;exclusion
        </h3>
        <p className="text-muted-foreground">
          Créez votre première période d&apos;exclusion pour gérer les dates non
          valides.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.map((period) => (
              <TableRow key={period.id}>
                <TableCell className="font-medium">{period.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {period.description || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>
                      Du{" "}
                      {format(new Date(period.startDate), "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </span>
                    <span>
                      Au{" "}
                      {format(new Date(period.endDate), "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={period.isRecurring ? "default" : "secondary"}>
                    {period.isRecurring ? "Récurrente" : "Ponctuelle"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {isCurrentPeriod(period) ? (
                    <Badge variant="destructive">En cours</Badge>
                  ) : isPastPeriod(period) ? (
                    <Badge variant="outline">Passée</Badge>
                  ) : (
                    <Badge variant="outline">À venir</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={actionLoading === period.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link
                        href={`/dashboard/exclusion-periods/${period.id}/edit`}
                      >
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setPeriodToDelete(period.id);
                          setDeleteDialogOpen(true);
                        }}
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette période d&apos;exclusion
              ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
