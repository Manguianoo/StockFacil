import { createApp } from "./app";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDatabase();
  const app = createApp();
  app.listen(PORT, () =>
    console.log(`Servidor corriendo en http://localhost:${PORT}`),
  );
}

start().catch((error) => {
  console.error("No fue posible iniciar el servidor", error);
  process.exit(1);
});
