import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import mongoose from "mongoose";
import routes from "./routes.js";

const app = express();

// Seguridad y utilidades
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Healthcheck
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Rutas propias
app.use("/api", routes);

// DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("tasks-service: Mongo conectado"))
  .catch((err) => console.error("tasks-service: Mongo error:", err));

// Export para tests
export { app };

// Arrancar servidor
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => console.log(`tasks-service escuchando en :${PORT}`));
}
