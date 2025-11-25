"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGiftCardSchema,
  type CreateGiftCardSchema,
} from "@/lib/validations/gift-card";
import { calculateExpiryDate } from "@/lib/types/gift-card";
import { MenuType } from "@/lib/types/menu-type";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function GiftCardCreateForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [loadingMenuTypes, setLoadingMenuTypes] = useState(true);

  const form = useForm<CreateGiftCardSchema>({
    resolver: zodResolver(createGiftCardSchema),
    defaultValues: {
      productType: "",
      numberOfPeople: 2,
      recipientName: "",
      purchaserName: "",
      purchaserEmail: "",
      amount: 0,
      expiryDate: calculateExpiryDate(),
      createdOnline: false,
    },
  });

  // Charger les types de menus actifs
  useEffect(() => {
    const fetchMenuTypes = async () => {
      try {
        const response = await fetch("/api/menu-types/active");
        if (response.ok) {
          const data = await response.json();
          setMenuTypes(data);
          // Définir le premier menu comme valeur par défaut
          if (data.length > 0) {
            const firstMenu = data[0];
            form.setValue("productType", firstMenu.name);
            form.setValue("amount", firstMenu.amount * 2); // 2 personnes par défaut
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des menus:", error);
        toast.error("Erreur lors du chargement des types de menus");
      } finally {
        setLoadingMenuTypes(false);
      }
    };

    fetchMenuTypes();
  }, [form]);

  // Mettre à jour le montant automatiquement quand le type de menu ou le nombre de personnes change
  const watchProductType = form.watch("productType");
  const watchNumberOfPeople = form.watch("numberOfPeople");

  useEffect(() => {
    if (menuTypes.length === 0) return;
    
    const menuType = menuTypes.find((m) => m.name === watchProductType);
    const numberOfPeople = watchNumberOfPeople || 0;
    
    if (menuType && numberOfPeople > 0) {
      const calculatedAmount = menuType.amount * numberOfPeople;
      form.setValue("amount", calculatedAmount, { shouldValidate: true });
    } else if (menuType && numberOfPeople === 0) {
      form.setValue("amount", 0, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchProductType, watchNumberOfPeople, menuTypes]);

  const onSubmit = async (data: CreateGiftCardSchema) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création");
      }

      const giftCard = await response.json();
      toast.success(`Bon cadeau créé avec succès ! Code : ${giftCard.code}`);
      router.push("/dashboard/gift-cards");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la création"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Type de produit */}
        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de menu</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
                disabled={loadingMenuTypes}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingMenuTypes ? "Chargement..." : "Sélectionnez un menu"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {menuTypes.map((menuType) => (
                    <SelectItem key={menuType.id} value={menuType.name}>
                      {menuType.name} - {menuType.amount.toFixed(2)}€
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {menuTypes.length === 0 && !loadingMenuTypes && (
                  <span className="text-destructive">
                    Aucun type de menu actif disponible. Créez-en un dans la section Types de menus.
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nombre de personnes */}
        <FormField
          control={form.control}
          name="numberOfPeople"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de personnes</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange(0);
                    } else {
                      const numValue = parseInt(value, 10);
                      if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
                        field.onChange(numValue);
                      }
                    }
                  }}
                />
              </FormControl>
              <FormDescription>Entre 1 et 20 personnes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Montant (calculé automatiquement) */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant total</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  value={field.value || 0}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      field.onChange(value);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Montant en euros (calculé automatiquement)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Destinataire du bon cadeau</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Le nom qui apparaîtra sur le bon cadeau
          </p>
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du destinataire</FormLabel>
                <FormControl>
                  <Input placeholder="Jean Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Informations de l&apos;acheteur</h3>
          <p className="text-sm text-muted-foreground mb-4">
            L&apos;acheteur recevra le bon cadeau avec le PDF par email
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="purchaserName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Marie Martin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchaserEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="marie.martin@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer le bon cadeau
          </Button>
        </div>
      </form>
    </Form>
  );
}

