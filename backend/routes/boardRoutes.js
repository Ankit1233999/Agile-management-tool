import express from "express";

import {
  createBoard,
  getWorkspaceBoards,
  getBoard,
  updateBoard,
  deleteBoard,
  addBoardMember,
  removeBoardMember
} from "../controllers/boardController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// All board routes require authentication
router.use(authMiddleware);


// Create board
router.post("/", createBoard);


// Get all boards of workspace
router.get("/workspace/:workspaceId", getWorkspaceBoards);


// Get single board
router.get("/:id", getBoard);


// Update board
router.put("/:id", updateBoard);


// Delete board
router.delete("/:id", deleteBoard);


// Add board member
router.post("/:id/members", addBoardMember);


// Remove board member
router.delete("/:id/members/:memberId", removeBoardMember);


export default router;