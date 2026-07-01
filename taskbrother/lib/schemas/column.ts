import { z } from "zod";

export const columnSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Il nome della colonna è obbligatorio")
    .max(20, "Il nome non può superare i 20 caratteri")
});

export type ColumnFormData = z.infer<typeof columnSchema>;
