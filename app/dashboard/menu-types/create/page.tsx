"use client";

import { MenuTypeForm } from "@/components/menu-types/menu-type-form";

export default function CreateMenuTypePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Nouveau type de menu
        </h1>
        <p className="text-muted-foreground">
          Créez un nouveau type de menu pour vos bons cadeaux
        </p>
      </div>

      <MenuTypeForm />
    </div>
  );
}

