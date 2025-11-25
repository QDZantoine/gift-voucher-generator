"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar } from "lucide-react";
import Link from "next/link";

export default function ValidationHistoryPage() {
  const [validations, setValidations] = useState<
    {
      id: string;
      giftCardCode: string;
      validatedAt: string;
      validatedBy: string;
      notes?: string;
      usedAt?: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchValidations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        status: "used",
        ...(search && { search }),
      });

      const response = await fetch(`/api/gift-cards?${params}`);
      if (response.ok) {
        const data = await response.json();
        setValidations(data.giftCards);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchValidations();
  }, [fetchValidations]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Historique des Validations</h1>
          <p className="text-muted-foreground">
            Consultez tous les bons cadeaux validés au restaurant
          </p>
        </div>
        <Link href="/dashboard/validation">
          <Button variant="outline">Retour à la validation</Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par code, destinataire ou acheteur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {validations.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucune validation trouvée
          </h3>
          <p className="text-muted-foreground">
            {search
              ? "Aucun bon validé ne correspond à votre recherche"
              : "Aucun bon cadeau n'a encore été validé"}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date de validation</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Destinataire</TableHead>
                <TableHead>Type de menu</TableHead>
                <TableHead>Personnes</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validations.map((validation) => (
                <TableRow key={validation.id}>
                  <TableCell>
                    {validation.usedAt
                      ? format(
                          new Date(validation.usedAt),
                          "dd MMMM yyyy à HH:mm",
                          { locale: fr }
                        )
                      : "-"}
                  </TableCell>
                  <TableCell className="font-mono font-medium">
                    {validation.giftCardCode}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {validation.validatedBy}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {validation.notes || "Aucune note"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell className="text-right font-medium">N/A</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
