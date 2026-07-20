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

export function parseOptionalDate(value: unknown, fallback: Date) {
  if (value === undefined || value === null || value === "") return fallback;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime()))
    throw new AppError("La fecha proporcionada no es válida", 400);
  return date;
}
