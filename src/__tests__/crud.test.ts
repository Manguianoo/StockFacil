import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { createApp } from "../app";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  test,
} from "@jest/globals";

const app = createApp();
let mongo: MongoMemoryReplSet;
let authorization: string;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-with-at-least-32-characters";
  process.env.NODE_ENV = "test";
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
  const response = await request(app).post("/auth/register").send({
    nombre: "Admin Test",
    email: "admin@stockfacil.test",
    password: "Password123",
  });
  authorization = `Bearer ${response.body.token}`;
});

afterEach(async () => {
  await mongoose.connection.db?.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test("realiza el CRUD de categorías", async () => {
  const created = await request(app)
    .post("/categorias")
    .set("Authorization", authorization)
    .send({ nombre: "Bebidas", descripcion: "Productos líquidos" });
  expect(created.status).toBe(201);

  const list = await request(app)
    .get("/categorias")
    .set("Authorization", authorization);
  expect(list.body).toHaveLength(1);

  const updated = await request(app)
    .put(`/categorias/${created.body._id}`)
    .set("Authorization", authorization)
    .send({ nombre: "Bebidas frías" });
  expect(updated.status).toBe(200);
  expect(updated.body.nombre).toBe("Bebidas frías");

  const deleted = await request(app)
    .delete(`/categorias/${created.body._id}`)
    .set("Authorization", authorization);
  expect(deleted.status).toBe(204);
  expect(
    (
      await request(app)
        .get(`/categorias/${created.body._id}`)
        .set("Authorization", authorization)
    ).status,
  ).toBe(404);
});

test("crea un producto y registra movimientos de inventario", async () => {
  const categoria = await request(app)
    .post("/categorias")
    .set("Authorization", authorization)
    .send({ nombre: "Abarrotes" });
  const producto = await request(app)
    .post("/productos")
    .set("Authorization", authorization)
    .send({
      nombre: "Arroz",
      sku: "ARR-001",
      precio: 25.5,
      stock: 10,
      stockMinimo: 3,
      categoria: categoria.body._id,
    });
  expect(producto.status).toBe(201);

  const salida = await request(app)
    .post("/inventario/salida")
    .set("Authorization", authorization)
    .send({
      producto: producto.body._id,
      cantidad: 4,
      motivo: "Venta mostrador",
    });
  expect(salida.status).toBe(201);
  expect(salida.body.stockNuevo).toBe(6);

  const entrada = await request(app)
    .post("/inventario/entrada")
    .set("Authorization", authorization)
    .send({
      producto: producto.body._id,
      cantidad: 10,
      motivo: "Compra proveedor",
    });
  expect(entrada.body.stockNuevo).toBe(16);
});

test("valida datos y evita salidas sin stock", async () => {
  expect(
    (
      await request(app)
        .post("/productos")
        .set("Authorization", authorization)
        .send({ nombre: "X" })
    ).status,
  ).toBe(400);
  const categoria = await request(app)
    .post("/categorias")
    .set("Authorization", authorization)
    .send({ nombre: "Limpieza" });
  const producto = await request(app)
    .post("/productos")
    .set("Authorization", authorization)
    .send({
      nombre: "Jabón",
      sku: "JAB-1",
      precio: 12,
      stock: 1,
      categoria: categoria.body._id,
    });
  const response = await request(app)
    .post("/inventario/salida")
    .set("Authorization", authorization)
    .send({ producto: producto.body._id, cantidad: 2, motivo: "Venta" });
  expect(response.status).toBe(409);
  expect(response.body.error).toBe("Stock insuficiente");
});

test("registra una venta, calcula total y descuenta existencias", async () => {
  const categoria = await request(app)
    .post("/categorias")
    .set("Authorization", authorization)
    .send({ nombre: "Dulces" });
  const producto = await request(app)
    .post("/productos")
    .set("Authorization", authorization)
    .send({
      nombre: "Chocolate",
      sku: "CHO-1",
      precio: 15,
      stock: 8,
      categoria: categoria.body._id,
    });
  const venta = await request(app)
    .post("/ventas")
    .set("Authorization", authorization)
    .send({ productos: [{ producto: producto.body._id, cantidad: 3 }] });
  expect(venta.status).toBe(201);
  expect(venta.body.total).toBe(45);
  expect(
    (
      await request(app)
        .get(`/productos/${producto.body._id}`)
        .set("Authorization", authorization)
    ).body.stock,
  ).toBe(5);
});

test("autentica usuarios y aplica permisos por rol", async () => {
  expect((await request(app).get("/productos")).status).toBe(401);

  const created = await request(app)
    .post("/auth/register")
    .set("Authorization", authorization)
    .send({
      nombre: "Operador",
      email: "operador@stockfacil.test",
      password: "Password123",
      rol: "operativo",
    });
  expect(created.status).toBe(201);

  const operativeToken = `Bearer ${created.body.token}`;
  expect(
    (
      await request(app)
        .post("/categorias")
        .set("Authorization", operativeToken)
        .send({ nombre: "Sin permiso" })
    ).status,
  ).toBe(403);
  expect(
    (await request(app).get("/productos").set("Authorization", operativeToken))
      .status,
  ).toBe(200);
});

test("expone el estado de salud de la aplicacion", async () => {
  const response = await request(app).get("/health");
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    status: "ok",
    database: "connected",
  });
});

test("valida el rango de fechas del reporte de ventas", async () => {
  const invalidDate = await request(app)
    .get("/reportes/ventas?desde=no-es-fecha")
    .set("Authorization", authorization);
  expect(invalidDate.status).toBe(400);
  expect(invalidDate.body.error).toBe("La fecha proporcionada no es válida");

  const reversedRange = await request(app)
    .get("/reportes/ventas?desde=2026-07-21&hasta=2026-07-20")
    .set("Authorization", authorization);
  expect(reversedRange.status).toBe(400);
  expect(reversedRange.body.error).toBe(
    "La fecha inicial no puede ser posterior a la final",
  );
});
