import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Введіть email")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Некоректний формат email"),
  password: z.string().min(1, "Введіть пароль"),
});

export type TLoginFormValues = z.infer<typeof loginSchema>;
