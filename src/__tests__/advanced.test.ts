import { createServer, Server as HttpServer } from "http";
import { AddressInfo } from "net";
import { afterAll, beforeAll, expect, test } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { SMTPServer } from "smtp-server";
import { io as createSocket, Socket } from "socket.io-client";
import request from "supertest";
import { createApp } from "../app";
import { createRealtimeServer } from "../config/realtime";
import { sendEmail } from "../services/emailService";

let mongo: MongoMemoryReplSet;
let httpServer: HttpServer;
let baseUrl: string;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-with-at-least-32-characters";
  process.env.NODE_ENV = "test";
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());

  httpServer = createServer(createApp());
  createRealtimeServer(httpServer);
  await new Promise<void>((resolve) => httpServer.listen(0, resolve));
  const address = httpServer.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
  await mongoose.disconnect();
  await mongo.stop();
});

async function createAdmin() {
  const response = await request(baseUrl).post("/auth/register").send({
    nombre: "Administrador",
    email: "admin@stockfacil.test",
    password: "Password123",
  });
  return response.body.token as string;
}

function waitForSocket(socket: Socket, event: string) {
  return new Promise<unknown>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`No se recibió ${event}`)),
      3000,
    );
    socket.once(event, (payload) => {
      clearTimeout(timer);
      resolve(payload);
    });
  });
}

test("notifica por socket cuando se crea un producto", async () => {
  const token = await createAdmin();
  const category = await request(baseUrl)
    .post("/categorias")
    .set("Authorization", `Bearer ${token}`)
    .send({ nombre: "Bebidas" });

  const socket = createSocket(baseUrl, {
    auth: { token },
    transports: ["websocket"],
    reconnection: false,
  });
  await waitForSocket(socket, "connect");
  const productEvent = waitForSocket(socket, "producto:creado");

  const response = await request(baseUrl)
    .post("/productos")
    .set("Authorization", `Bearer ${token}`)
    .send({
      nombre: "Agua mineral",
      sku: "AGUA-01",
      precio: 18,
      stock: 12,
      categoria: category.body._id,
    });

  expect(response.status).toBe(201);
  await expect(productEvent).resolves.toMatchObject({ sku: "AGUA-01" });
  socket.disconnect();
});

test("rechaza sockets que no presentan un token", async () => {
  const socket = createSocket(baseUrl, {
    transports: ["websocket"],
    reconnection: false,
  });
  const error = await waitForSocket(socket, "connect_error");
  expect(error).toMatchObject({ message: "No autorizado" });
  socket.disconnect();
});

test("envía un correo usando la configuración SMTP", async () => {
  let receivedMessage = "";
  const smtp = new SMTPServer({
    authOptional: true,
    disabledCommands: ["STARTTLS"],
    onData(stream, _session, callback) {
      stream.on("data", (chunk: Buffer) => {
        receivedMessage += chunk.toString();
      });
      stream.on("end", () => callback());
    },
  });
  await new Promise<void>((resolve) => smtp.listen(0, "127.0.0.1", resolve));
  const address = smtp.server.address() as AddressInfo;

  process.env.SMTP_HOST = "127.0.0.1";
  process.env.SMTP_PORT = String(address.port);
  process.env.SMTP_SECURE = "false";
  process.env.EMAIL_FROM = "StockFacil <no-reply@stockfacil.test>";

  const sent = await sendEmail({
    to: "encargado@stockfacil.test",
    subject: "Reporte de prueba",
    text: "El correo de StockFacil funciona.",
  });

  expect(sent).toBe(true);
  expect(receivedMessage).toContain("encargado@stockfacil.test");
  expect(receivedMessage).toContain("El correo de StockFacil funciona.");

  await new Promise<void>((resolve) => smtp.close(() => resolve()));
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_PORT;
  delete process.env.SMTP_SECURE;
  delete process.env.EMAIL_FROM;
});
