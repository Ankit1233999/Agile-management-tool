import mongoose from "mongoose";
import Workspace from "../models/Workspace.js";
import User from "../models/User.js";


// CREATE WORKSPACE
export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Workspace name is required"
      });
    }

    const workspace = await Workspace.create({
      name: name.trim(),
      description: description?.trim() || "",
      owner: req.userId,
      members: [req.userId]
    });

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      workspace: populatedWorkspace
    });
  } catch (error) {
    console.error("CREATE WORKSPACE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create workspace"
    });
  }
};


// GET ALL USER WORKSPACES
export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      members: req.userId
    })
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workspaces.length,
      workspaces
    });
  } catch (error) {
    console.error("GET WORKSPACES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workspaces"
    });
  }
};


// GET SINGLE WORKSPACE
export const getWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID"
      });
    }

    const workspace = await Workspace.findById(id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    const isMember = workspace.members.some(
      (member) => member._id.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this workspace"
      });
    }

    res.status(200).json({
      success: true,
      workspace
    });
  } catch (error) {
    console.error("GET WORKSPACE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workspace"
    });
  }
};


// UPDATE WORKSPACE
export const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID"
      });
    }

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    if (workspace.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the workspace owner can update it"
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Workspace name cannot be empty"
        });
      }

      workspace.name = name.trim();
    }

    if (description !== undefined) {
      workspace.description = description.trim();
    }

    await workspace.save();

    const updatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      workspace: updatedWorkspace
    });
  } catch (error) {
    console.error("UPDATE WORKSPACE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update workspace"
    });
  }
};


// DELETE WORKSPACE
export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID"
      });
    }

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    if (workspace.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the workspace owner can delete it"
      });
    }

    await Workspace.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully"
    });
  } catch (error) {
    console.error("DELETE WORKSPACE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete workspace"
    });
  }
};


// ADD MEMBER
export const addMember = async (req, res) => {
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
        message: "Invalid workspace ID"
      });
    }

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    if (workspace.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the workspace owner can add members"
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

    const alreadyMember = workspace.members.some(
      (member) => member.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "User is already a workspace member"
      });
    }

    workspace.members.push(user._id);

    await workspace.save();

    const updatedWorkspace = await Workspace.findById(id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      workspace: updatedWorkspace
    });
  } catch (error) {
    console.error("ADD MEMBER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add member"
    });
  }
};


// REMOVE MEMBER
export const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(memberId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace or member ID"
      });
    }

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    if (workspace.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the workspace owner can remove members"
      });
    }

    if (workspace.owner.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: "Workspace owner cannot be removed"
      });
    }

    workspace.members = workspace.members.filter(
      (member) => member.toString() !== memberId
    );

    await workspace.save();

    const updatedWorkspace = await Workspace.findById(id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      workspace: updatedWorkspace
    });
  } catch (error) {
    console.error("REMOVE MEMBER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove member"
    });
  }
};