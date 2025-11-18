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
import { MenuType } from "@/lib/types/menu-type";
import { MoreHorizontal, Pencil, Trash2, Utensils } from "lucide-react";
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

interface MenuTypeTableProps {
  menuTypes: MenuType[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export function MenuTypeTable({
  menuTypes,
  loading,
  page,
  totalPages,
  onPageChange,
  onRefresh,
}: MenuTypeTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuTypeToDelete, setMenuTypeToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!menuTypeToDelete) return;

    setActionLoading(menuTypeToDelete);
    try {
      const response = await fetch(`/api/menu-types/${menuTypeToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Type de menu supprimé avec succès");
        onRefresh();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
      setMenuTypeToDelete(null);
    }
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

  if (menuTypes.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Utensils className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Aucun type de menu
        </h3>
        <p className="text-muted-foreground">
          Créez votre premier type de menu pour commencer à gérer vos menus.
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
              <TableHead>Prix par personne</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuTypes.map((menuType) => (
              <TableRow key={menuType.id}>
                <TableCell className="font-medium">{menuType.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {menuType.description || "-"}
                </TableCell>
                <TableCell className="font-medium">
                  {menuType.amount.toFixed(2)} €
                </TableCell>
                <TableCell>
                  <Badge variant={menuType.isActive ? "default" : "secondary"}>
                    {menuType.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(menuType.createdAt), "dd MMM yyyy", {
                    locale: fr,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={actionLoading === menuType.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/dashboard/menu-types/${menuType.id}/edit`}>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setMenuTypeToDelete(menuType.id);
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
              Êtes-vous sûr de vouloir supprimer ce type de menu ? Cette action
              est irréversible. Si des bons cadeaux utilisent ce menu, la
              suppression sera refusée.
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

