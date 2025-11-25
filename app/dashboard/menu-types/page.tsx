"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MenuType } from "@/lib/types/menu-type";
import { MenuTypeFilters } from "@/components/menu-types/menu-type-filters";
import { MenuTypeTable } from "@/components/menu-types/menu-type-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MenuTypesPage() {
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  const fetchMenuTypes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(isActive && isActive !== "all" && { isActive }),
      });

      const response = await fetch(`/api/menu-types?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMenuTypes(data.menuTypes || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erreur API:", response.status, errorData);
        // Si erreur 401, l'utilisateur n'est pas connecté
        if (response.status === 401) {
          setError("Vous devez être connecté pour voir les types de menus");
        } else {
          setError(errorData.error || "Erreur lors du chargement des types de menus");
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des types de menus:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, isActive]);

  useEffect(() => {
    fetchMenuTypes();
  }, [fetchMenuTypes]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Types de Menus</h1>
          <p className="text-muted-foreground">
            Gérez les types de menus disponibles pour vos bons cadeaux
          </p>
        </div>
        <Link href="/dashboard/menu-types/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau type de menu
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des types de menus</CardTitle>
          <CardDescription>
            Filtrez et recherchez parmi tous vos types de menus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <MenuTypeFilters
            search={search}
            isActive={isActive}
            onSearchChange={setSearch}
            onIsActiveChange={setIsActive}
          />

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <MenuTypeTable
            menuTypes={menuTypes}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onRefresh={fetchMenuTypes}
          />
        </CardContent>
      </Card>
    </div>
  );
}

