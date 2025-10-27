import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["volunteer", "admin"]).default("volunteer"),
});

export const profileSchema = z.object({
  full_name: z.string().min(2).max(50),
  address1: z.string().min(2).max(100),
  address2: z.string().max(100).optional(),
  city: z.string().min(2).max(100),
  state: z.string().length(2, "State code must be 2 characters"),
  zip: z.string().min(5).max(9),
  preferences: z.string().max(500).optional(),
});

export const skillSchema = z.object({
  skill_name: z.string().min(2).max(50),
});

export const eventSchema = z.object({
  event_name: z.string().min(2).max(100),
  description: z.string().min(2).max(500),
  location: z.string().min(2).max(255),
  urgency: z.enum(["Low", "Medium", "High"]),
  event_date: z.coerce.date(),
});

export const volunteerHistorySchema = z.object({
  user_id: z.string().min(1, "user_id is required"),
  event_id: z.number().int().positive(),
  participation_date: z.coerce.date(),
  status: z.enum(["Registered", "Confirmed", "Attended", "No_Show", "Canceled", "Withdrawn"]),
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type VolunteerHistoryInput = z.infer<typeof volunteerHistorySchema>;