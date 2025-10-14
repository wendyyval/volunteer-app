import type { Request, Response, NextFunction } from "express";

export function requireAuth(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  const auth = req.header("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token) return res.status(401).json({ error: "Missing token" });

  // No-DB just yet phase: token is the userId returned by login/register
  req.user = { sub: token };
  next();
}
