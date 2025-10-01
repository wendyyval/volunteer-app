// server/src/middleware/requireAuth.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function getToken(req: Request) {
  const h = req.headers.authorization;
  if (!h) return null;
  const [scheme, token] = h.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: "Missing Authorization header" });
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      role: "admin" | "volunteer";
      iat?: number; exp?: number;
    };
    (req as any).user = decoded; // attach claims
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(...roles: Array<"admin" | "volunteer">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { role?: string } | undefined;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(user.role as any)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
