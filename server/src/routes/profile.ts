import { Router } from "express";
import { db } from "../store";
import { profileSchema } from "../validation";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

function getUserId(req: any) {
    return req.user?.sub ?? req.userId;
}

router.get("/me", requireAuth, (req: any, res) => {
    const userId = getUserId(req);
    const user = db.users.find(u => u.id === userId);

    console.log("Current users in DB:", db.users);

    if (!user) return res.status(404).json({ error: "User not found" });
    const profileWithId = user.profile ? { id: user.id, ...user.profile } : null;
    return res.json(profileWithId);
});

router.post("/me", requireAuth, (req: any, res) => {
    const parse = profileSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.format() });

    const userId = getUserId(req);
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.profile = parse.data;

    return res.status(200).json({ id: user.id, ...user.profile });
});

// Route to get all users (volunteers)
router.get("/users", (req, res) => {
    console.log("Returning all users:", db.users);
    res.json(db.users);
});


// Get all volunteer profiles
//router.get("/all", (req: any, res) => {
//    const volunteers = db.users
//        .filter(u => u.profile)
//        .map(u => ({
//            id: u.id,
//            ...u.profile
//        }));

//    res.json(volunteers);
//});

router.get("/me", requireAuth, (req: any, res) => {
  const userId = getUserId(req);
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const profileWithId = user.profile ? { id: user.id, ...user.profile } : null;
  return res.json(profileWithId);
});

router.post("/me", requireAuth, (req: any, res) => {
  const parse = profileSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });

  const userId = getUserId(req);
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.profile = parse.data;

  return res.status(200).json({ id: user.id, ...user.profile });
});

export default router;