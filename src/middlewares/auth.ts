import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.query.token === "12345") {
    next();
    return;
  }

  res.status(401).send("no estas logueado");
}
