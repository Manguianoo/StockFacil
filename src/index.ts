import { createApp } from "./app";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import { createServer } from "http";
import { createRealtimeServer } from "./config/realtime";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDatabase();
  const app = createApp();
  const server = createServer(app);
  createRealtimeServer(server);
  server.listen(PORT, () =>
    console.log(`Servidor corriendo en http://localhost:${PORT}`),
  );
}

start().catch((error) => {
  console.error("No fue posible iniciar el servidor", error);
  process.exit(1);
});
