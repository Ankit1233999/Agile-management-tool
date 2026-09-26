import express from "express";

import {
  createList,
  getBoardLists,
  getList,
  updateList,
  deleteList,
  reorderLists
} from "../controllers/listController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// All list routes require authentication
router.use(authMiddleware);


// Create list
router.post("/", createList);


// Get all lists of a board
router.get("/board/:boardId", getBoardLists);


// Reorder lists
router.put("/board/:boardId/reorder", reorderLists);


// Get single list
router.get("/:id", getList);


// Update list
router.put("/:id", updateList);


// Delete list
router.delete("/:id", deleteList);


export default router;