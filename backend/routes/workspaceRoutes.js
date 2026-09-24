import express from "express";

import {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember
} from "../controllers/workspaceController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// All workspace routes require authentication
router.use(authMiddleware);


// Create workspace
router.post("/", createWorkspace);


// Get user's workspaces
router.get("/", getWorkspaces);


// Get single workspace
router.get("/:id", getWorkspace);


// Update workspace
router.put("/:id", updateWorkspace);


// Delete workspace
router.delete("/:id", deleteWorkspace);


// Add member
router.post("/:id/members", addMember);


// Remove member
router.delete("/:id/members/:memberId", removeMember);


export default router;