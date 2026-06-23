import { z } from "zod";

/**
 * Schémas de validation Zod — toute entrée externe (formulaires, API) est
 * validée et nettoyée avant traitement (sécurité : cf. Phase 4).
 */

export const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nom trop court").max(80).trim(),
  email: z.string().email("Adresse e-mail invalide"),
  password: z
    .string()
    .min(8, "8 caractères minimum")
    .max(100)
    .regex(/[a-z]/, "Au moins une minuscule")
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
});

export const ENTITY_TYPES = [
  "COUNTRY",
  "CITY",
  "PLACE",
  "HOTEL",
  "RESTAURANT",
  "ARTICLE",
] as const;

export const favoriteSchema = z.object({
  entityType: z.enum(ENTITY_TYPES),
  entityId: z.string().min(1),
});

export const commentSchema = z.object({
  entityType: z.enum(ENTITY_TYPES),
  entityId: z.string().min(1),
  body: z.string().min(2, "Commentaire trop court").max(2000).trim(),
  parentId: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(80).trim(),
  email: z.string().email(),
  subject: z.string().min(2).max(120).trim(),
  message: z.string().min(10).max(3000).trim(),
  // Honeypot anti-spam : doit rester vide.
  website: z.string().max(0).optional(),
});

export const searchSchema = z.object({
  q: z.string().max(100).optional(),
  type: z.string().optional(),
  continent: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
