import { z } from "zod";

// Schéma de validation pour la création d'un bon cadeau
export const createGiftCardSchema = z.object({
  productType: z.string({
    required_error: "Le type de produit est requis",
    invalid_type_error: "Type de produit invalide",
  }).min(1, "Le type de produit est requis"),
  numberOfPeople: z
    .number({
      required_error: "Le nombre de personnes est requis",
      invalid_type_error: "Le nombre de personnes doit être un nombre",
    })
    .int("Le nombre doit être un entier")
    .min(1, "Minimum 1 personne")
    .max(20, "Maximum 20 personnes"),
  recipientName: z
    .string({
      required_error: "Le nom du destinataire est requis",
    })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  purchaserName: z
    .string({
      required_error: "Le nom de l'acheteur est requis",
    })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  purchaserEmail: z
    .string({
      required_error: "L'email de l'acheteur est requis",
    })
    .email("Email invalide"),
  amount: z
    .number({
      required_error: "Le montant est requis",
    })
    .positive("Le montant doit être positif")
    .max(1000, "Le montant maximum est de 1000€"),
  expiryDate: z.coerce.date({
    required_error: "La date d'expiration est requise",
    invalid_type_error: "Date invalide",
  }),
  createdOnline: z.boolean().default(false),
  customMessage: z.string().optional(),
});

export type CreateGiftCardSchema = z.infer<typeof createGiftCardSchema>;
