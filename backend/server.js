import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(helmet());

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);

/*
|--------------------------------------------------------------------------
| JSON
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "1mb"
  })
);

/*
|--------------------------------------------------------------------------
| Request Logger
|--------------------------------------------------------------------------
*/

app.use((req, _res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} ${req.url}`
  );

  next();
});

/*
|--------------------------------------------------------------------------
| Root
|--------------------------------------------------------------------------
*/

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Agile Management Tool API"
  });
});

/*
|--------------------------------------------------------------------------
| Health
|--------------------------------------------------------------------------
*/

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Backend server is running",
    database: "MongoDB connection configured",
    timestamp: new Date().toISOString()
  });
});

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  authRoutes
);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(
  (err, _req, res, _next) => {
    console.error(
      "SERVER ERROR:",
      err
    );

    res.status(
      err.status || 500
    ).json({
      success: false,
      message:
        err.message ||
        "Internal server error"
    });
  }
);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const startServer = async () => {
  await connectDB();

  app.listen(
    PORT,
    () => {
      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "   AGILE MANAGEMENT TOOL BACKEND"
      );
      console.log(
        "========================================"
      );
      console.log(
        `Server: http://localhost:${PORT}`
      );
      console.log(
        `Health: http://localhost:${PORT}/api/health`
      );
      console.log(
        "MongoDB: Connected"
      );
      console.log(
        "========================================"
      );
      console.log("");
    }
  );
};

startServer();