import mongoose from "mongoose";
import List from "../models/List.js";
import Board from "../models/Board.js";


// CREATE LIST
export const createList = async (req, res) => {
  try {
    const { name, boardId, position } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "List name is required"
      });
    }

    if (!boardId) {
      return res.status(400).json({
        success: false,
        message: "Board ID is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID"
      });
    }

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    // Check board membership
    const isMember = board.members.some(
      (member) => member.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    // If position isn't provided, place list at the end
    let listPosition = position;

    if (listPosition === undefined || listPosition === null) {
      const lastList = await List.findOne({
        board: boardId
      }).sort({ position: -1 });

      listPosition = lastList ? lastList.position + 1 : 0;
    }

    const list = await List.create({
      name: name.trim(),
      board: boardId,
      position: listPosition
    });

    const populatedList = await List.findById(list._id)
      .populate("board", "name description");

    res.status(201).json({
      success: true,
      message: "List created successfully",
      list: populatedList
    });
  } catch (error) {
    console.error("CREATE LIST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create list"
    });
  }
};


// GET ALL LISTS OF BOARD
export const getBoardLists = async (req, res) => {
  try {
    const { boardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID"
      });
    }

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    const isMember = board.members.some(
      (member) => member.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    const lists = await List.find({
      board: boardId
    })
      .populate("board", "name description")
      .sort({ position: 1 });

    res.status(200).json({
      success: true,
      count: lists.length,
      lists
    });
  } catch (error) {
    console.error("GET BOARD LISTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lists"
    });
  }
};


// GET SINGLE LIST
export const getList = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid list ID"
      });
    }

    const list = await List.findById(id)
      .populate("board", "name description members");

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    const isMember = list.board.members.some(
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
      list
    });
  } catch (error) {
    console.error("GET LIST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch list"
    });
  }
};


// UPDATE LIST
export const updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid list ID"
      });
    }

    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    const board = await Board.findById(list.board);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    const isMember = board.members.some(
      (member) => member.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "List name cannot be empty"
        });
      }

      list.name = name.trim();
    }

    await list.save();

    const updatedList = await List.findById(id)
      .populate("board", "name description");

    res.status(200).json({
      success: true,
      message: "List updated successfully",
      list: updatedList
    });
  } catch (error) {
    console.error("UPDATE LIST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update list"
    });
  }
};


// DELETE LIST
export const deleteList = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid list ID"
      });
    }

    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    const board = await Board.findById(list.board);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    const isMember = board.members.some(
      (member) => member.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    await List.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "List deleted successfully"
    });
  } catch (error) {
    console.error("DELETE LIST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete list"
    });
  }
};


// REORDER LISTS
export const reorderLists = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { lists } = req.body;

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID"
      });
    }

    if (!Array.isArray(lists)) {
      return res.status(400).json({
        success: false,
        message: "Lists must be an array"
      });
    }

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    const isMember = board.members.some(
      (member) => member.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    for (let index = 0; index < lists.length; index++) {
      const list = lists[index];

      if (!mongoose.Types.ObjectId.isValid(list.id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid list ID at position ${index}`
        });
      }

      await List.findOneAndUpdate(
        {
          _id: list.id,
          board: boardId
        },
        {
          position: index
        }
      );
    }

    const updatedLists = await List.find({
      board: boardId
    })
      .populate("board", "name description")
      .sort({ position: 1 });

    res.status(200).json({
      success: true,
      message: "Lists reordered successfully",
      lists: updatedLists
    });
  } catch (error) {
    console.error("REORDER LISTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reorder lists"
    });
  }
};