"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ExclusionPeriodForm } from "@/components/exclusion-periods/exclusion-period-form";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

export default function EditExclusionPeriodPage() {
  const params = useParams();
  const id = params.id as string;
  const [period, setPeriod] = useState<{
    id: string;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
    isActive: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeriod = async () => {
      try {
        const response = await fetch(`/api/exclusion-periods/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Formater les dates pour le formulaire
          setPeriod({
            ...data,
            description: data.description || undefined,
            startDate: format(new Date(data.startDate), "yyyy-MM-dd"),
            endDate: format(new Date(data.endDate), "yyyy-MM-dd"),
          });
        } else {
          toast.error("Période non trouvée");
        }
      } catch {
        toast.error("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchPeriod();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!period) {
    return (
      <div className="max-w-4xl">
        <p className="text-muted-foreground">Période non trouvée</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Modifier la Période</h1>
        <p className="text-muted-foreground">
          Modifiez les informations de la période d&apos;exclusion
        </p>
      </div>

      <ExclusionPeriodForm initialData={period} />
    </div>
  );
}
