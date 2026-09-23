import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { protectedTest } from "../controllers/protectedController.js";

const router = express.Router();

router.get("/test", authMiddleware, protectedTest);

export default router;