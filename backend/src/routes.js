"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("./db");
const validation_1 = require("./validation");
const { string } = require("../../node_modules/zod/v4/core/regexes.cjs");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
function requireAuth(req, res, next) {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token)
        return res.status(401).json({ error: "missing token" });
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: "invalid or expired token" });
    }
}
router.post("/auth/register", async (req, res) => {
    const parsed = validation_1.credentialsSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { email, password, role } = parsed.data;
    const existing = await db_1.prisma.user_credentials.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ error: "email already registered" });
    const hash = await bcryptjs_1.default.hash(password, 10);
    const user = await db_1.prisma.user_credentials.create({
        data: { email, password_hash: hash, role },
    });
    const token = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
    });
    res.json({ message: "Registered successfully", token });
});
router.post("/auth/login", async (req, res) => {
    const parsed = validation_1.credentialsSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { email, password } = parsed.data;
    const user = await db_1.prisma.user_credentials.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: "invalid credentials" });
    const valid = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!valid)
        return res.status(401).json({ error: "invalid credentials" });
    const token = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
    });
    res.json({ message: "Login successful", token });
});
router.get("/me/profile", requireAuth, async (req, res) => {
    const profile = await db_1.prisma.user_profile.findUnique({
        where: { user_id: req.user.sub },
    });
    res.json({ profile });
});
router.post("/me/profile", requireAuth, async (req, res) => {
    const parsed = validation_1.profileSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;
    const profile = await db_1.prisma.user_profile.upsert({
        where: { user_id: req.user.sub },
        update: data,
        create: { user_id: req.user.sub, ...data },
    });
    res.json({ message: "Profile saved", profile });
});
router.get("/events", async (_req, res) => {
    const items = await db_1.prisma.event_details.findMany({ orderBy: { event_date: "asc" } });
    res.json({ events: items });
});
router.post("/events", requireAuth, async (req, res) => {
    const parsed = validation_1.eventSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });

    const { requiredSkills, ...eventData } = parsed.data;

    // create the event first
    const event = await db_1.prisma.event_details.create({ data: parsed.data });


    for (const skillName of requiredSkills) {
        // Find skill in the DB
        const skill = await db_1.prisma.skills.findFirst({
            where: { skill_name: skillName }
        });

        if (skill) {
            await db_1.prisma.event_skills.create({
                data: {
                    event_id: event.event_id,
                    skill_id: skill.skill_id
                }
            });
        }
    }

    res.json({ message: "Event created", event });
});
//router.post("/events", requireAuth, async (req, res) => {
//    console.log("POST /events hit", req.body);

//    const parsed = validation_1.eventSchema.safeParse(req.body);
//    if (!parsed.success)
//        return res.status(400).json({ error: parsed.error.flatten() });

//    const { requiredSkills, ...eventData } = parsed.data;

//    // Create the event first
//    const event = await db_1.prisma.event_details.create({
//        data: eventData,
//    });

//    console.log("Created event:", event);
//    console.log("Received skills to assign:", requiredSkills);

//    // Assign existing skills to the event
//    if (Array.isArray(requiredSkills) && requiredSkills.length > 0) {
//        const skillRecords = await db_1.prisma.skill.findMany({
//            where: { skill_name: { in: requiredSkills } },
//        });

//        console.log("Found skills in DB:", skillRecords);

//        await db_1.prisma.eventSkill.createMany({
//            data: skillRecords.map((skill) => ({
//                event_id: event.event_id,
//                skill_id: skill.skill_id,
//            })),
//            skipDuplicates: true,
//        });
//    }

//    // Return event with linked skills
//    const eventWithSkills = await db_1.prisma.event_details.findUnique({
//        where: { event_id: event.event_id },
//        include: { event_skills: { include: { skill: true } } },
//    });

//    console.log("Event with assigned skills:", eventWithSkills);

//    res.json({ message: "Event created", event: eventWithSkills });
//});


router.get("/me/history", requireAuth, async (req, res) => {
    const items = await db_1.prisma.volunteer_history.findMany({
        where: { user_id: req.user.sub },
        include: { event: true },
        orderBy: { participation_date: "desc" },
    });
    res.json({ history: items });
});
router.post("/me/history", requireAuth, async (req, res) => {
    const parsed = validation_1.volunteerHistorySchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const record = await db_1.prisma.volunteer_history.create({ data: parsed.data });
    res.json({ message: "History record added", record });
});


// Get all skills
router.get("/skills", async (req, res) => {
    try {
        const skills = await db_1.prisma.skills.findMany({
            select: { skill_id: true, skill_name: true },
            orderBy: { skill_name: "asc" },
        });
        res.json({ skills });
    } catch (error) {
        console.error("Error fetching skills:", error);
        res.status(500).json({ error: "Failed to fetch skills" });
    }
});


exports.default = router;
