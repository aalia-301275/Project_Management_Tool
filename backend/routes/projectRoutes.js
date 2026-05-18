const express = require("express");

const {
  createProject,
  getProjects,
} = require("../controllers/projectController");

const router = express.Router();

// Create Project Route
router.post("/", createProject);

// Get Projects
router.get("/", getProjects);

module.exports = router;