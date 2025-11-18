import { z } from "zod";

export const MenuTypeSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  description: z.string().optional(),
  amount: z.number().positive("Le montant doit être positif").min(0.01, "Le montant doit être supérieur à 0"),
  isActive: z.boolean().default(true),
});

export type MenuTypeFormValues = z.infer<typeof MenuTypeSchema>;

export interface MenuType {
  id: string;
  name: string;
  description?: string | null;
  amount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

