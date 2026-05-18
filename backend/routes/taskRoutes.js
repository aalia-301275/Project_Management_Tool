const express = require("express");
const Task = require("../models/Task");

const {
  createTask,
  getTasksByProject,
  updateTaskStatus,
} = require("../controllers/taskController");

const router = express.Router();

// Create Task Route
router.post("/", createTask);

// Get Tasks By Project
router.get("/:projectId", getTasksByProject);

// Update Task Status
router.put("/:taskId", updateTaskStatus);


//delete
router.delete("/:id", async (req, res) => {
  try {

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;