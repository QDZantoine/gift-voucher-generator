"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ExclusionPeriodSchema,
  ExclusionPeriodFormValues,
} from "@/lib/types/exclusion-period";
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
import { Checkbox } from "@/components/ui/checkbox";
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

interface ExclusionPeriodFormProps {
  initialData?: ExclusionPeriodFormValues & { id: string };
}

export function ExclusionPeriodForm({ initialData }: ExclusionPeriodFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExclusionPeriodFormValues>({
    resolver: zodResolver(ExclusionPeriodSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      isRecurring: false,
      recurringType: "none",
    },
  });

  const isRecurring = form.watch("isRecurring");

  const onSubmit = async (data: ExclusionPeriodFormValues) => {
    setIsSubmitting(true);
    try {
      const url = initialData
        ? `/api/exclusion-periods/${initialData.id}`
        : "/api/exclusion-periods";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          initialData
            ? "Période modifiée avec succès"
            : "Période créée avec succès"
        );
        router.push("/dashboard/exclusion-periods");
        router.refresh();
      } else {
        const error = await response.json();
        if (error.overlappingPeriods) {
          toast.error(
            "Cette période chevauche une période existante : " +
              error.overlappingPeriods
                .map((p: { name: string }) => p.name)
                .join(", ")
          );
        } else {
          toast.error(error.error || "Erreur lors de l'enregistrement");
        }
      }
    } catch (_error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Modifier la période" : "Informations de la période"}
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
                  <FormLabel>Nom de la période *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Feria de Bayonne, Noël, etc."
                      {...field}
                    />
                  </FormControl>
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
                      placeholder="Description optionnelle de la période..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ajoutez une description pour mieux identifier cette période
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : field.value || ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : field.value || ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Période récurrente</FormLabel>
                    <FormDescription>
                      Cochez cette case si cette période se répète chaque année
                      (ex: Noël, Feria)
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {isRecurring && (
              <FormField
                control={form.control}
                name="recurringType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de récurrence</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yearly">Annuelle</SelectItem>
                        <SelectItem value="none">Aucune</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Les périodes annuelles se répètent automatiquement chaque
                      année aux mêmes dates
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                {initialData ? "Modifier" : "Créer"} la période
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
