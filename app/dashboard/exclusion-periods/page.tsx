"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ExclusionPeriod } from "@/lib/types/exclusion-period";
import { ExclusionPeriodFilters } from "@/components/exclusion-periods/exclusion-period-filters";
import { ExclusionPeriodTable } from "@/components/exclusion-periods/exclusion-period-table";

export default function ExclusionPeriodsPage() {
  const [periods, setPeriods] = useState<ExclusionPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isRecurring, setIsRecurring] = useState<string>("all");

  const fetchPeriods = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(isRecurring && isRecurring !== "all" && { isRecurring }),
      });

      const response = await fetch(`/api/exclusion-periods?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPeriods(data.periods);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des périodes:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, isRecurring]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Périodes d&apos;Exclusion</h1>
          <p className="text-muted-foreground">
            Gérez les périodes pendant lesquelles les bons cadeaux ne sont pas
            valides
          </p>
        </div>
        <Link href="/dashboard/exclusion-periods/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle période
          </Button>
        </Link>
      </div>

      <ExclusionPeriodFilters
        search={search}
        isRecurring={isRecurring}
        onSearchChange={setSearch}
        onIsRecurringChange={setIsRecurring}
      />

      <ExclusionPeriodTable
        periods={periods}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRefresh={fetchPeriods}
      />
    </div>
  );
}
