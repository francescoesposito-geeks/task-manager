import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Il titolo è obbligatorio")
    .max(50, "Max 50 caratteri"),
  description: z.string().trim().max(250).optional().or(z.literal("")),
  priority: z.enum(["importante", "non-importante"], {
    message: "Seleziona un livello di importanza"
  }),
  urgency: z.enum(["urgente", "non-urgente"], {
    message: "Seleziona il livello di urgenza"
  }),
  state: z.enum(["to-do", "doing", "testing", "done", "blocked"], {
    message: "Seleziona lo stato"
  }),
  deadline: z.string().optional().or(z.literal(""))
});

export type TaskFormData = z.infer<typeof taskSchema>;
