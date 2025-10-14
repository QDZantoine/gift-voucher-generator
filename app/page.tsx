"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Gift, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { MENU_PRICES, MenuType } from "@/lib/stripe";

const orderSchema = z.object({
  menuType: z.enum([
    "Menu Influences",
    "Menu Dégustation",
    "Menu Prestige",
    "Menu Découverte",
  ]),
  numberOfPeople: z.coerce
    .number()
    .min(1, "Minimum 1 personne")
    .max(20, "Maximum 20 personnes"),
  recipientName: z.string().min(2, "Nom requis"),
  recipientEmail: z.string().email("Email invalide"),
  purchaserName: z.string().min(2, "Nom requis"),
  purchaserEmail: z.string().email("Email invalide"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      numberOfPeople: 2,
      menuType: "Menu Influences",
      recipientName: "",
      recipientEmail: "",
      purchaserName: "",
      purchaserEmail: "",
    },
  });

  const menuType = form.watch("menuType") as MenuType;
  const numberOfPeople = form.watch("numberOfPeople");
  const totalAmount = MENU_PRICES[menuType] * numberOfPeople;

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
          <Gift className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-[#1A2B4B] mb-4 sm:mb-6" />
          <h1 className="font-playfair-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2B4B] mb-3 sm:mb-4">
            Offrez Influences
          </h1>
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
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="font-lato border-[#1A2B4B]/20 focus:border-[#1A2B4B] focus:ring-2 focus:ring-[#1A2B4B]/20 transition-colors">
                              <SelectValue placeholder="Sélectionnez un menu" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="font-lato">
                            {Object.entries(MENU_PRICES).map(
                              ([menu, price]) => (
                                <SelectItem key={menu} value={menu}>
                                  {menu} - {price}€ / pers.
                                </SelectItem>
                              )
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
                        Nom complet *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jean Dupont"
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
                  name="recipientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-lato font-medium text-[#1A2B4B]">
                        Email *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jean.dupont@example.com"
                          {...field}
                          className="font-lato border-[#1A2B4B]/20 focus:border-[#1A2B4B] focus:ring-2 focus:ring-[#1A2B4B]/20 transition-colors"
                        />
                      </FormControl>
                      <FormDescription className="font-lato text-[#1A2B4B]/70">
                        Le bon cadeau sera envoyé à cette adresse
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
                  Vos coordonnées
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
                        Pour recevoir la confirmation de commande
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
