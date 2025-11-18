"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gift, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  total: number;
  active: number;
  used: number;
  expired: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    used: 0,
    expired: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/gift-cards/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de vos bons cadeaux
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des bons
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Bons générés au total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bons actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.active}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Non utilisés et valides
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bons utilisés</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.used}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Validés en restaurant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bons expirés</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.expired}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Date d&apos;expiration dépassée
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bienvenue sur votre dashboard</CardTitle>
          <CardDescription>Gérez vos bons cadeaux facilement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/dashboard/gift-cards/create">
            <div className="rounded-lg border p-4 hover:bg-accent hover:border-accent-foreground/20 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-2">🎁 Créer un bon cadeau</h3>
              <p className="text-sm text-muted-foreground">
                Allez dans &quot;Bons cadeaux&quot; pour créer un nouveau bon
                directement depuis le restaurant.
              </p>
            </div>
          </Link>
          <Link href="/dashboard/validation">
            <div className="rounded-lg border p-4 hover:bg-accent hover:border-accent-foreground/20 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-2">✅ Valider un bon</h3>
              <p className="text-sm text-muted-foreground">
                Utilisez la section &quot;Validation&quot; pour scanner ou
                rechercher un bon à valider.
              </p>
            </div>
          </Link>
          <Link href="/dashboard/exclusion-periods">
            <div className="rounded-lg border p-4 hover:bg-accent hover:border-accent-foreground/20 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-2">📅 Gérer les exclusions</h3>
              <p className="text-sm text-muted-foreground">
                Configurez les périodes spéciales (Noël, Feria, etc.) dans
                &quot;Périodes d&apos;exclusion&quot;.
              </p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
