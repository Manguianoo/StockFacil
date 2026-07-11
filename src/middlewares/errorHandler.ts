import { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/AppError";

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new AppError("Ruta no encontrada", 404));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ error: error.message, details: error.details });
    return;
  }
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      error: "Datos inválidos",
      details: Object.values(error.errors).map((item) => item.message),
    });
    return;
  }
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: "Identificador inválido" });
    return;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    res
      .status(409)
      .json({ error: "Ya existe un registro con ese valor único" });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor" });
};
