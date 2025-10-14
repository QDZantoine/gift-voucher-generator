import { z } from "zod";

export const ExclusionPeriodSchema = z
  .object({
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    description: z.string().optional(),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    isRecurring: z.boolean().default(false),
    recurringType: z.enum(["none", "yearly"]).optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "La date de fin doit être après la date de début",
      path: ["endDate"],
    }
  );

export const UpdateExclusionPeriodSchema = z
  .object({
    name: z
      .string()
      .min(3, "Le nom doit contenir au moins 3 caractères")
      .optional(),
    description: z.string().optional(),
    startDate: z.string().or(z.date()).optional(),
    endDate: z.string().or(z.date()).optional(),
    isRecurring: z.boolean().optional(),
    recurringType: z.enum(["none", "yearly"]).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end > start;
      }
      return true;
    },
    {
      message: "La date de fin doit être après la date de début",
      path: ["endDate"],
    }
  );

