"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { MenuType } from "@/lib/types/menu-type";

const orderSchema = z.object({
  menuType: z.string().min(1, "Le type de menu est requis"),
  numberOfPeople: z.coerce
    .number()
    .min(1, "Minimum 1 personne")
    .max(20, "Maximum 20 personnes"),
  recipientName: z.string().min(2, "Nom du destinataire requis"),
  purchaserName: z.string().min(2, "Nom requis"),
  purchaserEmail: z.string().email("Email invalide"),
  customMessage: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [loadingMenuTypes, setLoadingMenuTypes] = useState(true);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      numberOfPeople: 2,
      menuType: "",
      recipientName: "",
      purchaserName: "",
      purchaserEmail: "",
      customMessage: "",
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
            form.setValue("menuType", data[0].name);
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

  const menuTypeName = form.watch("menuType");
  const numberOfPeople = form.watch("numberOfPeople");
  const selectedMenuType = menuTypes.find((m) => m.name === menuTypeName);
  const totalAmount = selectedMenuType
    ? selectedMenuType.amount * numberOfPeople
    : 0;

  const onSubmit = async (data: OrderFormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const { url, error } = await response.json();

      if (error) {
        toast.error(error);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch {
      toast.error("Erreur lors de la création de la session de paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-12rem)] flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F7F2] to-[#F0EFE8]"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          {/* <Gift className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-[#1A2B4B] mb-4 sm:mb-6" /> */}
          {/* <h1 className="font-playfair-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2B4B] mb-3 sm:mb-4">
            Offrez Influences
          </h1> */}
          <div className="flex justify-center items-center mb-8">
            <Image
              src="/images/logo-bleu.svg"
              alt="Influences Logo"
              width={600}
              height={600}
            />
          </div>
          <p className="font-lato text-lg sm:text-xl text-[#1A2B4B]/80 max-w-2xl mx-auto px-4 sm:px-0">
            Offrez un moment de partage à vos proches ! En quelques clics,
            recevez directement par mail, nos bons cadeaux.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8"
          >
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="font-playfair-display text-xl sm:text-2xl font-semibold text-[#1A2B4B]">
                  Choisissez votre formule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="menuType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-lato font-medium text-[#1A2B4B]">
                          Type de menu *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={loadingMenuTypes || menuTypes.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger className="font-lato border-[#1A2B4B]/20 focus:border-[#1A2B4B] focus:ring-2 focus:ring-[#1A2B4B]/20 transition-colors">
                              <SelectValue
                                placeholder={
                                  loadingMenuTypes
                                    ? "Chargement..."
                                    : "Sélectionnez un menu"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="font-lato">
                            {loadingMenuTypes ? (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                Chargement...
                              </div>
                            ) : menuTypes.length === 0 ? (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                Aucun menu disponible
                              </div>
                            ) : (
                              menuTypes.map((menuType) => (
                                <SelectItem
                                  key={menuType.id}
                                  value={menuType.name}
                                >
                                  {menuType.name} - {menuType.amount.toFixed(2)}
                                  € / pers.
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfPeople"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-lato font-medium text-[#1A2B4B]">
                          Nombre de personnes *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            {...field}
                            className="font-lato border-[#1A2B4B]/20 focus:border-[#1A2B4B] focus:ring-2 focus:ring-[#1A2B4B]/20 transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-[#1A2B4B]/5 rounded-lg p-4 sm:p-6 border border-[#1A2B4B]/10">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <span className="font-lato text-base sm:text-lg font-medium text-[#1A2B4B]">
                      Montant total :
                    </span>
                    <span className="font-playfair-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A2B4B]">
                      {totalAmount.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="font-playfair-display text-xl sm:text-2xl font-semibold text-[#1A2B4B]">
                  Destinataire du bon cadeau
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-lato font-medium text-[#1A2B4B]">
                        Nom du destinataire *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jean Dupont"
                          {...field}
                          className="font-lato border-[#1A2B4B]/20 focus:border-[#1A2B4B] focus:ring-2 focus:ring-[#1A2B4B]/20 transition-colors"
                        />
                      </FormControl>
                      <FormDescription className="font-lato text-[#1A2B4B]/70">
                        Le nom qui apparaîtra sur le bon cadeau
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="font-playfair-display text-xl sm:text-2xl font-semibold text-[#1A2B4B]">
                  Vos informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <FormField
                  control={form.control}
                  name="purchaserName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-lato font-medium text-[#1A2B4B]">
                        Nom complet *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Marie Martin"
                          {...field}
                          className="font-lato border-[#1A2B4B]/20 focus:border-[#1A2B4B] focus:ring-2 focus:ring-[#1A2B4B]/20 transition-colors"
                        />
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
                      <FormLabel className="font-lato font-medium text-[#1A2B4B]">
                        Email *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="marie.martin@example.com"
                          {...field}
                          className="font-lato border-[#1A2B4B]/20 focus:border-[#1A2B4B] focus:ring-2 focus:ring-[#1A2B4B]/20 transition-colors"
                        />
                      </FormControl>
                      <FormDescription className="font-lato text-[#1A2B4B]/70">
                        Le bon cadeau avec le PDF sera envoyé à cette adresse
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-lato font-medium text-[#1A2B4B]">
                        Message personnalisé
                      </FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Écrivez un message personnalisé qui apparaîtra sur le bon cadeau..."
                          {...field}
                          rows={4}
                          className="font-lato w-full px-3 py-2 border border-[#1A2B4B]/20 rounded-md focus:border-[#1A2B4B] focus:ring-2 focus:ring-[#1A2B4B]/20 focus:outline-none transition-colors resize-none"
                        />
                      </FormControl>
                      <FormDescription className="font-lato text-[#1A2B4B]/70">
                        Ce message apparaîtra sur le bon cadeau PDF
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="space-y-3 sm:space-y-4">
              <Button
                type="submit"
                size="lg"
                className="w-full font-lato text-base sm:text-lg py-4 sm:py-6 bg-transparent text-[#1A2B4B] border-2 border-[#1A2B4B] hover:bg-[#1A2B4B] hover:text-white focus:ring-2 focus:ring-[#1A2B4B]/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    <span className="hidden sm:inline">Préparation...</span>
                    <span className="sm:hidden">Préparation...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">
                      Procéder au paiement ({totalAmount.toFixed(2)} €)
                    </span>
                    <span className="sm:hidden">
                      Payer ({totalAmount.toFixed(2)} €)
                    </span>
                  </>
                )}
              </Button>

              <p className="text-center font-lato text-xs sm:text-sm text-[#1A2B4B]/70 px-4 sm:px-0">
                Paiement sécurisé par Stripe • Validité 1 an
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
