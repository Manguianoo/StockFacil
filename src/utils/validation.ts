import { AppError } from "../errors/AppError";

export function requireFields(body: Record<string, unknown>, fields: string[]) {
  const missing = fields.filter(
    (field) =>
      body[field] === undefined || body[field] === null || body[field] === "",
  );
  if (missing.length > 0)
    throw new AppError("Faltan campos obligatorios", 400, missing);
}

export function requireNonEmptyUpdate(body: Record<string, unknown>) {
  if (Object.keys(body).length === 0)
    throw new AppError("Debe enviar al menos un campo para actualizar", 400);
}
