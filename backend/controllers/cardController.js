import mongoose from "mongoose";
import Card from "../models/Card.js";
import List from "../models/List.js";
import Board from "../models/Board.js";
import User from "../models/User.js";


// Helper: check board membership
const checkBoardMembership = async (boardId, userId) => {
  const board = await Board.findById(boardId);

  if (!board) {
    return {
      board: null,
      isMember: false
    };
  }

  const isMember = board.members.some(
    (member) => member.toString() === userId
  );

  return {
    board,
    isMember
  };
};


// CREATE CARD
export const createCard = async (req, res) => {
  try {
    const {
      title,
      description,
      listId,
      priority,
      assignedTo,
      dueDate
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Card title is required"
      });
    }

    if (!listId) {
      return res.status(400).json({
        success: false,
        message: "List ID is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid list ID"
      });
    }

    // Find list
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    // Check board
    const { board, isMember } = await checkBoardMembership(
      list.board,
      req.userId
    );

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    // Validate priority
    const validPriorities = ["low", "medium", "high"];

    if (
      priority !== undefined &&
      !validPriorities.includes(priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Priority must be low, medium or high"
      });
    }

    // Validate assigned user
    let assignedUserId = null;

    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID"
        });
      }

      const user = await User.findById(assignedTo);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found"
        });
      }

      const isBoardMember = board.members.some(
        (member) => member.toString() === assignedTo
      );

      if (!isBoardMember) {
        return res.status(400).json({
          success: false,
          message: "Assigned user must be a board member"
        });
      }

      assignedUserId = assignedTo;
    }

    // Automatically place card at end
    const lastCard = await Card.findOne({
      list: listId
    }).sort({ position: -1 });

    const position = lastCard
      ? lastCard.position + 1
      : 0;

    const card = await Card.create({
      title: title.trim(),
      description: description?.trim() || "",
      list: listId,
      board: list.board,
      assignedTo: assignedUserId,
      priority: priority || "medium",
      position,
      dueDate: dueDate || null
    });

    const populatedCard = await Card.findById(card._id)
      .populate("list", "name position")
      .populate("board", "name")
      .populate("assignedTo", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Card created successfully",
      card: populatedCard
    });
  } catch (error) {
    console.error("CREATE CARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create card"
    });
  }
};


// GET CARDS OF A LIST
export const getListCards = async (req, res) => {
  try {
    const { listId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid list ID"
      });
    }

    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    const { board, isMember } = await checkBoardMembership(
      list.board,
      req.userId
    );

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    const cards = await Card.find({
      list: listId
    })
      .populate("assignedTo", "name email avatar")
      .sort({ position: 1 });

    res.status(200).json({
      success: true,
      count: cards.length,
      cards
    });
  } catch (error) {
    console.error("GET LIST CARDS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cards"
    });
  }
};


// GET ALL CARDS OF BOARD
export const getBoardCards = async (req, res) => {
  try {
    const { boardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID"
      });
    }

    const { board, isMember } = await checkBoardMembership(
      boardId,
      req.userId
    );

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    const cards = await Card.find({
      board: boardId
    })
      .populate("list", "name position")
      .populate("assignedTo", "name email avatar")
      .sort({ list: 1, position: 1 });

    res.status(200).json({
      success: true,
      count: cards.length,
      cards
    });
  } catch (error) {
    console.error("GET BOARD CARDS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch board cards"
    });
  }
};


// GET SINGLE CARD
export const getCard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid card ID"
      });
    }

    const card = await Card.findById(id)
      .populate("list", "name position")
      .populate("board", "name members")
      .populate("assignedTo", "name email avatar");

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    const isMember = card.board.members.some(
      (member) => member.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    res.status(200).json({
      success: true,
      card
    });
  } catch (error) {
    console.error("GET CARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch card"
    });
  }
};


// UPDATE CARD
export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      priority,
      assignedTo,
      dueDate
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid card ID"
      });
    }

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    const { board, isMember } = await checkBoardMembership(
      card.board,
      req.userId
    );

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    // Title
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Card title cannot be empty"
        });
      }

      card.title = title.trim();
    }

    // Description
    if (description !== undefined) {
      card.description = description.trim();
    }

    // Priority
    if (priority !== undefined) {
      const validPriorities = [
        "low",
        "medium",
        "high"
      ];

      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid priority"
        });
      }

      card.priority = priority;
    }

    // Assignment
    if (assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === "") {
        card.assignedTo = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
          return res.status(400).json({
            success: false,
            message: "Invalid assigned user ID"
          });
        }

        const user = await User.findById(assignedTo);

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "Assigned user not found"
          });
        }

        const isBoardMember = board.members.some(
          (member) => member.toString() === assignedTo
        );

        if (!isBoardMember) {
          return res.status(400).json({
            success: false,
            message: "Assigned user must be a board member"
          });
        }

        card.assignedTo = assignedTo;
      }
    }

    // Due date
    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === "") {
        card.dueDate = null;
      } else {
        const parsedDate = new Date(dueDate);

        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid due date"
          });
        }

        card.dueDate = parsedDate;
      }
    }

    await card.save();

    const updatedCard = await Card.findById(id)
      .populate("list", "name position")
      .populate("board", "name")
      .populate("assignedTo", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Card updated successfully",
      card: updatedCard
    });
  } catch (error) {
    console.error("UPDATE CARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update card"
    });
  }
};


// MOVE CARD TO ANOTHER LIST
export const moveCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { listId, position } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid card ID"
      });
    }

    if (!listId) {
      return res.status(400).json({
        success: false,
        message: "Destination list ID is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid destination list ID"
      });
    }

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    const { board, isMember } = await checkBoardMembership(
      card.board,
      req.userId
    );

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    const destinationList = await List.findById(listId);

    if (!destinationList) {
      return res.status(404).json({
        success: false,
        message: "Destination list not found"
      });
    }

    // Make sure destination list belongs to same board
    if (destinationList.board.toString() !== card.board.toString()) {
      return res.status(400).json({
        success: false,
        message: "Destination list belongs to another board"
      });
    }

    const oldListId = card.list.toString();

    // If position isn't provided, put card at end
    let newPosition = position;

    if (newPosition === undefined || newPosition === null) {
      const lastCard = await Card.findOne({
        list: listId,
        _id: { $ne: card._id }
      }).sort({ position: -1 });

      newPosition = lastCard
        ? lastCard.position + 1
        : 0;
    }

    // Move card
    card.list = listId;
    card.position = newPosition;

    await card.save();

    // Reorder cards in old list
    if (oldListId !== listId) {
      const oldCards = await Card.find({
        list: oldListId
      }).sort({ position: 1 });

      for (let index = 0; index < oldCards.length; index++) {
        oldCards[index].position = index;
        await oldCards[index].save();
      }
    }

    // Reorder cards in destination list
    const destinationCards = await Card.find({
      list: listId
    }).sort({ position: 1 });

    for (let index = 0; index < destinationCards.length; index++) {
      destinationCards[index].position = index;
      await destinationCards[index].save();
    }

    const updatedCard = await Card.findById(id)
      .populate("list", "name position")
      .populate("board", "name")
      .populate("assignedTo", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Card moved successfully",
      card: updatedCard
    });
  } catch (error) {
    console.error("MOVE CARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to move card"
    });
  }
};


// REORDER CARDS
export const reorderCards = async (req, res) => {
  try {
    const { listId } = req.params;
    const { cards } = req.body;

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid list ID"
      });
    }

    if (!Array.isArray(cards)) {
      return res.status(400).json({
        success: false,
        message: "Cards must be an array"
      });
    }

    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    const { board, isMember } = await checkBoardMembership(
      list.board,
      req.userId
    );

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    for (let index = 0; index < cards.length; index++) {
      const card = cards[index];

      if (!mongoose.Types.ObjectId.isValid(card.id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid card ID at position ${index}`
        });
      }

      await Card.findOneAndUpdate(
        {
          _id: card.id,
          list: listId
        },
        {
          position: index
        }
      );
    }

    const updatedCards = await Card.find({
      list: listId
    })
      .populate("assignedTo", "name email avatar")
      .sort({ position: 1 });

    res.status(200).json({
      success: true,
      message: "Cards reordered successfully",
      cards: updatedCards
    });
  } catch (error) {
    console.error("REORDER CARDS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reorder cards"
    });
  }
};


// DELETE CARD
export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid card ID"
      });
    }

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    const { board, isMember } = await checkBoardMembership(
      card.board,
      req.userId
    );

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    await Card.findByIdAndDelete(id);

    // Reorder remaining cards
    const remainingCards = await Card.find({
      list: card.list
    }).sort({ position: 1 });

    for (let index = 0; index < remainingCards.length; index++) {
      remainingCards[index].position = index;
      await remainingCards[index].save();
    }

    res.status(200).json({
      success: true,
      message: "Card deleted successfully"
    });
  } catch (error) {
    console.error("DELETE CARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete card"
    });
  }
};