"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  MenuTypeSchema,
  MenuTypeFormValues,
} from "@/lib/types/menu-type";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { PDFTemplate, DEFAULT_TEMPLATES } from "@/lib/pdf-templates";

interface MenuTypeFormProps {
  initialData?: MenuTypeFormValues & { id: string };
}

export function MenuTypeForm({ initialData }: MenuTypeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templates, setTemplates] = useState<PDFTemplate[]>([]);

  // Charger les templates disponibles
  useEffect(() => {
    const defaultTemplates = DEFAULT_TEMPLATES.map((template, index) => ({
      ...template,
      id: `template-${index}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    setTemplates(defaultTemplates.filter((t) => t.isActive));
  }, []);

  const form = useForm<MenuTypeFormValues>({
    resolver: zodResolver(MenuTypeSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      amount: 0,
      isActive: true,
      templateId: undefined,
    },
  });

  const onSubmit = async (data: MenuTypeFormValues) => {
    setIsSubmitting(true);
    try {
      const url = initialData
        ? `/api/menu-types/${initialData.id}`
        : "/api/menu-types";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          initialData
            ? "Type de menu modifié avec succès"
            : "Type de menu créé avec succès"
        );
        router.push("/dashboard/menu-types");
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de l'enregistrement");
      }
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Modifier le type de menu" : "Nouveau type de menu"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du menu *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Menu Influences, Menu Dégustation, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Le nom du menu tel qu&apos;il apparaîtra dans les bons cadeaux
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description optionnelle du menu..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ajoutez une description pour mieux identifier ce menu
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix par personne (€) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="45.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Le prix par personne en euros. Le montant total sera calculé
                    en multipliant ce prix par le nombre de personnes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Menu actif</FormLabel>
                    <FormDescription>
                      Les menus inactifs ne seront pas disponibles lors de la
                      création de nouveaux bons cadeaux
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template PDF pour l&apos;envoi d&apos;email</FormLabel>
                  <Select
                    value={field.value || "none"}
                    onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Aucun template (utiliser le template par défaut)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucun template (par défaut)</SelectItem>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} {template.productType && `(${template.productType})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Sélectionnez un template PDF à utiliser lors de l&apos;envoi d&apos;email pour les bons cadeaux de ce type de menu
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {initialData ? "Modifier" : "Créer"} le type de menu
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

