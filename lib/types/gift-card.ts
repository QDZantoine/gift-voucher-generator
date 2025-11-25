import { GiftCard } from "../generated/prisma";

// Type pour la création d'un bon cadeau
export interface CreateGiftCardInput {
  productType: string;
  numberOfPeople: number;
  recipientName: string;
  purchaserName: string;
  purchaserEmail: string;
  amount: number;
  expiryDate: Date;
  createdBy?: string; // ID de l'admin (optionnel si créé en ligne)
  createdOnline: boolean;
}

// Type pour la réponse API
export interface GiftCardWithUser extends GiftCard {
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  menuType?: {
    id: string;
    name: string;
    description: string | null;
    amount: number;
  } | null;
}

// Types de produits disponibles
export const PRODUCT_TYPES = [
  { value: "menu-influences", label: "Menu Influences", price: 45 },
  { value: "menu-degustation", label: "Menu Dégustation", price: 65 },
  { value: "menu-carte-blanche", label: "Menu Carte Blanche", price: 85 },
  { value: "brunch", label: "Brunch", price: 35 },
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number]["value"];

// Statut d'un bon cadeau
export type GiftCardStatus = "active" | "used" | "expired";

export function getGiftCardStatus(giftCard: GiftCard): GiftCardStatus {
  if (giftCard.isUsed) return "used";
  if (new Date(giftCard.expiryDate) < new Date()) return "expired";
  return "active";
}

// Calculer la date d'expiration (1 an par défaut)
export function calculateExpiryDate(purchaseDate: Date = new Date()): Date {
  const expiryDate = new Date(purchaseDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  return expiryDate;
}

