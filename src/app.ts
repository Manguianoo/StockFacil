import express, { static as static_ } from "express";
import routes from "./routes";
import path from "path";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; connect-src 'self' ws: wss:; img-src 'self' data:; script-src 'self'; style-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    );
    if (process.env.NODE_ENV === "production")
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains",
      );
    next();
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(static_(path.join(__dirname, "../public")));

  app.use(routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
