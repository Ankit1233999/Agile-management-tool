import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(helmet());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));

// Request logger
app.use((req, _res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} ${req.url}`
  );

  next();
});

// Root route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Agile Management Tool API"
  });
});

// Health route
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Backend server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Protected test routes
app.use("/api/protected", protectedRoutes);

// Workspace routes
app.use("/api/workspaces", workspaceRoutes);

// Board routes
app.use("/api/boards", boardRoutes);

// List routes
app.use("/api/lists", listRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

// Connect database and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("========================================");
      console.log("   AGILE MANAGEMENT TOOL BACKEND");
      console.log("========================================");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log(`Frontend: ${CLIENT_URL}`);
      console.log(
        `Environment: ${process.env.NODE_ENV || "development"}`
      );
      console.log("========================================");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();