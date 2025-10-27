"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.volunteerHistorySchema = exports.eventSchema = exports.skillSchema = exports.profileSchema = exports.credentialsSchema = void 0;
const zod_1 = require("zod");
exports.credentialsSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
    role: zod_1.z.enum(["volunteer", "admin"]).default("volunteer"),
});
exports.profileSchema = zod_1.z.object({
    full_name: zod_1.z.string().min(2).max(50),
    address1: zod_1.z.string().min(2).max(100),
    address2: zod_1.z.string().max(100).optional(),
    city: zod_1.z.string().min(2).max(100),
    state: zod_1.z.string().length(2, "State code must be 2 characters"),
    zip: zod_1.z.string().min(5).max(9),
    preferences: zod_1.z.string().max(500).optional(),
});
exports.skillSchema = zod_1.z.object({
    skill_name: zod_1.z.string().min(2).max(50),
});
exports.eventSchema = zod_1.z.object({
    event_name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().min(2).max(500),
    location: zod_1.z.string().min(2).max(255),
    urgency: zod_1.z.enum(["Low", "Medium", "High"]),
    event_date: zod_1.z.coerce.date(),
});
exports.volunteerHistorySchema = zod_1.z.object({
    user_id: zod_1.z.string().min(1, "user_id is required"),
    event_id: zod_1.z.number().int().positive(),
    participation_date: zod_1.z.coerce.date(),
    status: zod_1.z.enum(["Registered", "Confirmed", "Attended", "No_Show", "Canceled", "Withdrawn"]),
});
