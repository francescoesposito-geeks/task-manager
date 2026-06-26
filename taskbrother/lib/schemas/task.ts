import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Il titolo è obbligatorio")
    .max(25, "Il titolo non può superare i 25 caratteri"),
  description: z
    .string()
    .trim()
    .max(100, "La descrizione non può superare i 100 caratteri")
    .optional()
    .or(z.literal("")),
  priority: z.enum(["bassa", "media", "alta"], {
    message: "Seleziona una priorità valida"
  })
});

export type TaskFormData = z.infer<typeof taskSchema>;
