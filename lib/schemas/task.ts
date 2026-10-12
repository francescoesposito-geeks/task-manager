import { z } from "zod";

// fields of a task, also used to validate tasks read from localStorage
export const taskFieldsSchema = z.object({
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
  startDate: z.string().min(1, "La data di inizio è obbligatoria"),
  endDate: z.string().min(1, "La scadenza è obbligatoria")
});

// the form also checks that the deadline is not before the start date
export const taskSchema = taskFieldsSchema.refine(
  (task) => task.endDate >= task.startDate,
  {
    message: "La scadenza non può essere prima della data di inizio",
    path: ["endDate"]
  }
);

export type TaskFormData = z.infer<typeof taskSchema>;
