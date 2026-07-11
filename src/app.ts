import express, { static as static_ } from "express";
import routes from "./routes";
import path from "path";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(static_(path.join(__dirname, "../public")));

  app.use(routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
