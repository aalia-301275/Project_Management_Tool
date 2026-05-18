const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, projectId } = req.body;

    const task = await Task.create({
      title,
      project: projectId,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Tasks By Project
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({
      project: projectId,
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Task Status
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: "Task status updated",
      updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {

    const { taskId } = req.params;

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  deleteTask,
};