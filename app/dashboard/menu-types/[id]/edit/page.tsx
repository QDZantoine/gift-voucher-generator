"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MenuTypeForm } from "@/components/menu-types/menu-type-form";
import { MenuTypeFormValues } from "@/lib/types/menu-type";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function EditMenuTypePage() {
  const params = useParams();
  const router = useRouter();
  const [menuType, setMenuType] = useState<MenuTypeFormValues & { id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuType = async () => {
      try {
        const response = await fetch(`/api/menu-types/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setMenuType({
            id: data.id,
            name: data.name,
            description: data.description || "",
            amount: data.amount,
            isActive: data.isActive,
            templateId: data.templateId || undefined,
          });
        } else {
          toast.error("Type de menu non trouvé");
          router.push("/dashboard/menu-types");
        }
      } catch {
        toast.error("Erreur lors du chargement du type de menu");
        router.push("/dashboard/menu-types");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMenuType();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!menuType) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Modifier le type de menu
        </h1>
        <p className="text-muted-foreground">
          Modifiez les informations du type de menu
        </p>
      </div>

      <MenuTypeForm initialData={menuType} />
    </div>
  );
}

