import express, { static as static_ } from "express";
import routes from "./routes";
import path from "path";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(static_(path.join(__dirname, "../public")));

  app.use(routes);

  return app;
}
