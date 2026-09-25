import mongoose from "mongoose";
import Board from "../models/Board.js";
import Workspace from "../models/Workspace.js";
import User from "../models/User.js";


// CREATE BOARD
export const createBoard = async (req, res) => {
  try {
    const { name, description, workspaceId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Board name is required"
      });
    }

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "Workspace ID is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID"
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    const isMember = workspace.members.some(
      (member) => member.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this workspace"
      });
    }

    const board = await Board.create({
      name: name.trim(),
      description: description?.trim() || "",
      workspace: workspaceId,
      owner: req.userId,
      members: [req.userId]
    });

    const populatedBoard = await Board.findById(board._id)
      .populate("workspace", "name description")
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Board created successfully",
      board: populatedBoard
    });
  } catch (error) {
    console.error("CREATE BOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create board"
    });
  }
};


// GET ALL BOARDS OF A WORKSPACE
export const getWorkspaceBoards = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID"
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    const isMember = workspace.members.some(
      (member) => member.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this workspace"
      });
    }

    const boards = await Board.find({
      workspace: workspaceId
    })
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: boards.length,
      boards
    });
  } catch (error) {
    console.error("GET WORKSPACE BOARDS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch boards"
    });
  }
};


// GET SINGLE BOARD
export const getBoard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID"
      });
    }

    const board = await Board.findById(id)
      .populate("workspace", "name description")
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    const isMember = board.members.some(
      (member) => member._id.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this board"
      });
    }

    res.status(200).json({
      success: true,
      board
    });
  } catch (error) {
    console.error("GET BOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch board"
    });
  }
};


// UPDATE BOARD
export const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID"
      });
    }

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the board owner can update it"
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Board name cannot be empty"
        });
      }

      board.name = name.trim();
    }

    if (description !== undefined) {
      board.description = description.trim();
    }

    await board.save();

    const updatedBoard = await Board.findById(id)
      .populate("workspace", "name description")
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Board updated successfully",
      board: updatedBoard
    });
  } catch (error) {
    console.error("UPDATE BOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update board"
    });
  }
};


// DELETE BOARD
export const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID"
      });
    }

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the board owner can delete it"
      });
    }

    await Board.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Board deleted successfully"
    });
  } catch (error) {
    console.error("DELETE BOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete board"
    });
  }
};


// ADD BOARD MEMBER
export const addBoardMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Member email is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID"
      });
    }

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the board owner can add members"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist"
      });
    }

    // Verify user belongs to the workspace
    const workspace = await Workspace.findById(board.workspace);

    const workspaceMember = workspace.members.some(
      (member) => member.toString() === user._id.toString()
    );

    if (!workspaceMember) {
      return res.status(400).json({
        success: false,
        message: "User must be a workspace member before joining the board"
      });
    }

    const alreadyMember = board.members.some(
      (member) => member.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "User is already a board member"
      });
    }

    board.members.push(user._id);

    await board.save();

    const updatedBoard = await Board.findById(id)
      .populate("workspace", "name description")
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Board member added successfully",
      board: updatedBoard
    });
  } catch (error) {
    console.error("ADD BOARD MEMBER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add board member"
    });
  }
};


// REMOVE BOARD MEMBER
export const removeBoardMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(memberId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid board or member ID"
      });
    }

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the board owner can remove members"
      });
    }

    if (board.owner.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: "Board owner cannot be removed"
      });
    }

    board.members = board.members.filter(
      (member) => member.toString() !== memberId
    );

    await board.save();

    const updatedBoard = await Board.findById(id)
      .populate("workspace", "name description")
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Board member removed successfully",
      board: updatedBoard
    });
  } catch (error) {
    console.error("REMOVE BOARD MEMBER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove board member"
    });
  }
}; 