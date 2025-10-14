import { z } from "zod";

export const ExclusionPeriodSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isRecurring: z.boolean().default(false),
  recurringType: z.enum(["none", "yearly"]).optional(),
});

export type ExclusionPeriodFormValues = z.infer<typeof ExclusionPeriodSchema>;

export interface ExclusionPeriod {
  id: string;
  name: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  isRecurring: boolean;
  recurringType?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function isDateInExclusionPeriod(
  date: Date,
  periods: ExclusionPeriod[]
): { isExcluded: boolean; period?: ExclusionPeriod } {
  for (const period of periods) {
    const checkDate = new Date(date);
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);

    if (period.isRecurring && period.recurringType === "yearly") {
      // Pour les périodes récurrentes annuelles, on compare seulement le mois et le jour
      const startMonth = startDate.getMonth();
      const startDay = startDate.getDate();

      const endMonth = endDate.getMonth();
      const endDay = endDate.getDate();

      // Créer des dates dans la même année pour comparer
      const yearToCheck = checkDate.getFullYear();
      const periodStart = new Date(yearToCheck, startMonth, startDay);
      const periodEnd = new Date(yearToCheck, endMonth, endDay);

      // Si la période chevauche l'année (ex: 20 déc - 5 jan)
      if (periodEnd < periodStart) {
        if (checkDate >= periodStart || checkDate <= periodEnd) {
          return { isExcluded: true, period };
        }
      } else {
        if (checkDate >= periodStart && checkDate <= periodEnd) {
          return { isExcluded: true, period };
        }
      }
    } else {
      // Pour les périodes non récurrentes
      if (checkDate >= startDate && checkDate <= endDate) {
        return { isExcluded: true, period };
      }
    }
  }

  return { isExcluded: false };
}
