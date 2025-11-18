"use client";

import { useRouter } from "next/navigation";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GiftCardTable } from "@/components/gift-cards/gift-card-table";
import { GiftCardFilters } from "@/components/gift-cards/gift-card-filters";
import { useGiftCards } from "@/contexts/GiftCardContext";

export default function GiftCardsPage() {
  const router = useRouter();
  const { state, actions } = useGiftCards();

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
            status={state.status}
            onStatusChange={actions.setStatus}
            search={state.search}
            onSearchChange={actions.setSearch}
          />

          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{state.error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={actions.retry}
                  className="ml-4"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réessayer
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <GiftCardTable
            giftCards={state.giftCards}
            loading={state.loading}
            page={state.page}
            totalPages={state.totalPages}
            onPageChange={actions.setPage}
            onRefresh={actions.retry}
          />
        </CardContent>
      </Card>
    </div>
  );
}
