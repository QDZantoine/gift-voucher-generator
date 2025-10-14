"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GiftCardTable } from "@/components/gift-cards/gift-card-table";
import { GiftCardFilters } from "@/components/gift-cards/gift-card-filters";
import { GiftCardWithUser, GiftCardStatus } from "@/lib/types/gift-card";

export default function GiftCardsPage() {
  const router = useRouter();
  const [giftCards, setGiftCards] = useState<GiftCardWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<GiftCardStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchGiftCards();
  }, [status, search, page]);

  const fetchGiftCards = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.append("status", status);
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("limit", "10");

      const response = await fetch(`/api/gift-cards?${params}`);
      if (!response.ok) throw new Error("Erreur lors du chargement");

      const data = await response.json();
      setGiftCards(data.giftCards);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching gift cards:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bons Cadeaux</h1>
          <p className="text-muted-foreground">
            Gérez tous les bons cadeaux de votre restaurant
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/gift-cards/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau bon cadeau
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des bons cadeaux</CardTitle>
          <CardDescription>
            Filtrez et recherchez parmi tous vos bons cadeaux
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GiftCardFilters
            status={status}
            onStatusChange={setStatus}
            search={search}
            onSearchChange={setSearch}
          />

          <GiftCardTable
            giftCards={giftCards}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onRefresh={fetchGiftCards}
          />
        </CardContent>
      </Card>
    </div>
  );
}

