import express from "express";
import cors from "cors";
import helmet from "helmet";
import HttpStatusCode from "./constants/http-status-codes.js";
import { linkRouter } from "./routes/link.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { env } from "./config/env.js";
import { shortCodeParamsSchema } from "./validators/link.validators.js";
import { validateParams } from "./middlewares/validate.middleware.js";
import { linkController } from "./controllers/link.controller.js";

export const app = express();

// --- Security / parsing middleware ---
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// --- CORS ---
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin (curl, mobile apps, server-to-server, Postman)
    if (!origin) return callback(null, true);

    // Wildcard mode (dev only)
    if (env.CORS_ORIGINS === "*") return callback(null, true);

    // Allow if the origin is in the allowlist
    if (Array.isArray(env.CORS_ORIGINS) && env.CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: [],           // e.g. ["X-Total-Count"] if you paginate
  credentials: true,            // set true only if using cookies
  maxAge: 86400,                // cache preflight for 24h
  optionsSuccessStatus: 204,    // some old browsers choke on 200
};

app.use(cors(corsOptions));

// Handle preflight for all routes (Express 5 no longer does this automatically)
app.options(/.*/, cors(corsOptions));

// --- Routes ---
app.get("/api/health", (_req, res) => {
  res.status(HttpStatusCode.OK).json({ message: "ok" });
});

app.get("/:sc",  validateParams(shortCodeParamsSchema), linkController.redirectLink);
app.use("/api/links", linkRouter);
app.use("/api/auth", authRouter);