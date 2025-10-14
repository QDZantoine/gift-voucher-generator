import Stripe from "stripe";

// Utilisation d'un placeholder pour éviter les erreurs au build
// La vraie clé sera chargée au runtime
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key",
  {
    apiVersion: "2025-09-30.clover",
    typescript: true,
  }
);

// Prix des menus (en euros)
export const MENU_PRICES = {
  "Menu Influences": 45,
  "Menu Dégustation": 65,
  "Menu Prestige": 85,
  "Menu Découverte": 35,
} as const;

export type MenuType = keyof typeof MENU_PRICES;

export function calculateGiftCardAmount(
  menuType: MenuType,
  numberOfPeople: number
): number {
  return MENU_PRICES[menuType] * numberOfPeople;
}
