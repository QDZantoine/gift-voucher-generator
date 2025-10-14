"use client";

import { ExclusionPeriodForm } from "@/components/exclusion-periods/exclusion-period-form";

export default function CreateExclusionPeriodPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Nouvelle Période d&apos;Exclusion
        </h1>
        <p className="text-muted-foreground">
          Créez une nouvelle période pendant laquelle les bons cadeaux ne seront
          pas valides
        </p>
      </div>

      <ExclusionPeriodForm />
    </div>
  );
}
