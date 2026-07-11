import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../app";
import { afterAll, afterEach, beforeAll, expect, test } from "@jest/globals";

const app = createApp();
let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
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
    .send({ nombre: "Bebidas", descripcion: "Productos líquidos" });
  expect(created.status).toBe(201);

  const list = await request(app).get("/categorias");
  expect(list.body).toHaveLength(1);

  const updated = await request(app)
    .put(`/categorias/${created.body._id}`)
    .send({ nombre: "Bebidas frías" });
  expect(updated.status).toBe(200);
  expect(updated.body.nombre).toBe("Bebidas frías");

  const deleted = await request(app).delete(`/categorias/${created.body._id}`);
  expect(deleted.status).toBe(204);
  expect(
    (await request(app).get(`/categorias/${created.body._id}`)).status,
  ).toBe(404);
});

test("crea un producto y registra movimientos de inventario", async () => {
  const categoria = await request(app)
    .post("/categorias")
    .send({ nombre: "Abarrotes" });
  const producto = await request(app).post("/productos").send({
    nombre: "Arroz",
    sku: "ARR-001",
    precio: 25.5,
    stock: 10,
    stockMinimo: 3,
    categoria: categoria.body._id,
  });
  expect(producto.status).toBe(201);

  const salida = await request(app).post("/inventario/salida").send({
    producto: producto.body._id,
    cantidad: 4,
    motivo: "Venta mostrador",
  });
  expect(salida.status).toBe(201);
  expect(salida.body.stockNuevo).toBe(6);

  const entrada = await request(app).post("/inventario/entrada").send({
    producto: producto.body._id,
    cantidad: 10,
    motivo: "Compra proveedor",
  });
  expect(entrada.body.stockNuevo).toBe(16);
});

test("valida datos y evita salidas sin stock", async () => {
  expect(
    (await request(app).post("/productos").send({ nombre: "X" })).status,
  ).toBe(400);
  const categoria = await request(app)
    .post("/categorias")
    .send({ nombre: "Limpieza" });
  const producto = await request(app).post("/productos").send({
    nombre: "Jabón",
    sku: "JAB-1",
    precio: 12,
    stock: 1,
    categoria: categoria.body._id,
  });
  const response = await request(app)
    .post("/inventario/salida")
    .send({ producto: producto.body._id, cantidad: 2, motivo: "Venta" });
  expect(response.status).toBe(409);
  expect(response.body.error).toBe("Stock insuficiente");
});

test("registra una venta, calcula total y descuenta existencias", async () => {
  const categoria = await request(app)
    .post("/categorias")
    .send({ nombre: "Dulces" });
  const producto = await request(app).post("/productos").send({
    nombre: "Chocolate",
    sku: "CHO-1",
    precio: 15,
    stock: 8,
    categoria: categoria.body._id,
  });
  const venta = await request(app)
    .post("/ventas")
    .send({ productos: [{ producto: producto.body._id, cantidad: 3 }] });
  expect(venta.status).toBe(201);
  expect(venta.body.total).toBe(45);
  expect(
    (await request(app).get(`/productos/${producto.body._id}`)).body.stock,
  ).toBe(5);
});
