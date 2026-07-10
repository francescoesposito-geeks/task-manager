import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Il titolo è obbligatorio")
    .max(25, "Max 25 caratteri"),
  description: z.string().trim().max(200).optional().or(z.literal("")),
  priority: z.enum(["importante", "non-importante"], {
    message: "Seleziona un livello di importanza"
  }),
  urgency: z.enum(["urgente", "non-urgente"], {
    message: "Seleziona il livello di urgenza"
  }),
  state: z.enum(["to-do", "doing", "testing", "done"], {
    message: "Seleziona lo stato"
  })
});

export type TaskFormData = z.infer<typeof taskSchema>;
