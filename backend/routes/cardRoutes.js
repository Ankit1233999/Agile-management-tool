import express from "express";

import {
  createCard,
  getListCards,
  getBoardCards,
  getCard,
  updateCard,
  moveCard,
  reorderCards,
  deleteCard
} from "../controllers/cardController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// All card routes require authentication
router.use(authMiddleware);


// Create card
router.post("/", createCard);


// Get all cards of a list
router.get("/list/:listId", getListCards);


// Get all cards of a board
router.get("/board/:boardId", getBoardCards);


// Reorder cards inside a list
router.put("/list/:listId/reorder", reorderCards);


// Get single card
router.get("/:id", getCard);


// Update card
router.put("/:id", updateCard);


// Move card between lists
router.put("/:id/move", moveCard);


// Delete card
router.delete("/:id", deleteCard);


export default router;