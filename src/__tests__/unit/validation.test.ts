import { describe, expect, test } from "@jest/globals";
import { AppError } from "../../errors/AppError";
import {
  parseOptionalDate,
  requireFields,
  requireNonEmptyUpdate,
} from "../../utils/validation";

describe("utilidades de validacion", () => {
  test("identifica todos los campos obligatorios faltantes", () => {
    expect(() =>
      requireFields({ nombre: "", precio: null }, [
        "nombre",
        "precio",
        "categoria",
      ]),
    ).toThrow(
      expect.objectContaining<AppError>({
        statusCode: 400,
        details: ["nombre", "precio", "categoria"],
      }),
    );
  });

  test("acepta valores validos y el numero cero", () => {
    expect(() =>
      requireFields({ nombre: "Producto", stock: 0 }, ["nombre", "stock"]),
    ).not.toThrow();
  });

  test("rechaza actualizaciones vacias", () => {
    expect(() => requireNonEmptyUpdate({})).toThrow(
      expect.objectContaining<AppError>({ statusCode: 400 }),
    );
  });

  test("convierte una fecha ISO valida", () => {
    expect(
      parseOptionalDate("2026-07-20T12:00:00.000Z", new Date(0)).toISOString(),
    ).toBe("2026-07-20T12:00:00.000Z");
  });

  test("usa el valor predeterminado cuando no se envia fecha", () => {
    const fallback = new Date("2026-01-01T00:00:00.000Z");
    expect(parseOptionalDate(undefined, fallback)).toBe(fallback);
  });

  test("rechaza fechas invalidas con un error 400", () => {
    expect(() => parseOptionalDate("fecha-invalida", new Date(0))).toThrow(
      expect.objectContaining<AppError>({ statusCode: 400 }),
    );
  });
});
