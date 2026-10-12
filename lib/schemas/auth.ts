import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email non valida"),
  password: z.string().min(8, "La password deve avere almeno 8 caratteri")
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().max(50, "Max 50 caratteri").optional()
});

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Scrivi un nome per il profilo")
    .max(30, "Max 30 caratteri")
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
