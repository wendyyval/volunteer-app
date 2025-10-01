import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      sub: string;               //user id
      role: "admin" | "volunteer";
      iat?: number;
      exp?: number;
      
    };
  }
}