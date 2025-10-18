import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["volunteer", "admin"]).default("volunteer")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const profileSchema = z.object({
  fullName: z.string().min(1).max(50),
  address1: z.string().min(1).max(100),
  address2: z.string().max(100).optional(),
  city: z.string().min(1).max(100),
  state: z.string().length(2),
  zip: z.string().min(5).max(9),
  skills: z.array(z.string()).min(1),
  preferences: z.string().optional(),
  availability: z.array(z.string()) // ISO strings
});

export const eventSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1),
  location: z.string().min(1),
  requiredSkills: z.array(z.string()).min(1),
  urgency: z.enum(["Low","Medium","High"]),
  date: z.string()
});
