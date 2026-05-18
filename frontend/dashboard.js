let currentFilter = "All";
// CREATE PROJECT
async function createProject() {

  const title = document.getElementById("projectTitle").value;
  const description = document.getElementById("projectDescription").value;

  if (!title || !description) {
    alert("Project title and description required");
    return;
  }

  const res = await fetch("http://localhost:5000/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });

  const data = await res.json();

  alert(data.message);

  loadProjects();
}


// LOAD PROJECTS
async function loadProjects() {

  console.log("Loading projects...");

  const res = await fetch("http://localhost:5000/api/projects");
  const projects = await res.json();

  console.log("Projects received:", projects);

  const projectList = document.getElementById("projectList");

  if (!projectList) {
    console.error("projectList div not found in HTML");
    return;
  }

  // CLEAR OLD CONTENT FIRST
  projectList.innerHTML = "";

  // LOOP THROUGH PROJECTS
  projects.forEach((project) => {

    projectList.innerHTML += `
      <div class="project-card">

        <h3>${project.title}</h3>
        <p>${project.description}</p>

        <!-- PROGRESS BAR -->
        <div class="progress-container">
          <div class="progress-bar" id="progress-${project._id}"></div>
        </div>

        <p id="progress-text-${project._id}"></p>

        <input 
          type="text" 
          id="task-${project._id}" 
          placeholder="New Task"
        >

        <button onclick="createTask('${project._id}')">
          Add Task
        </button>

        <div id="tasks-${project._id}"></div>

      </div>
    `;

    // LOAD TASKS FOR THIS PROJECT
    loadTasks(project._id);

  });
}


// CREATE TASK
async function createTask(projectId) {

  const input = document.getElementById(`task-${projectId}`);
  const title = input.value.trim();

  if (!title) {
    alert("Task cannot be empty");
    return;
  }

  const res = await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      projectId,
    }),
  });

  const data = await res.json();

  alert(data.message);

  input.value = "";

  loadTasks(projectId);
}


// LOAD TASKS
async function loadTasks(projectId) {

  console.log("Loading tasks for:", projectId);

  const res = await fetch(
    `http://localhost:5000/api/tasks/${projectId}`
  );

  const tasks = await res.json();

  const taskContainer = document.getElementById(`tasks-${projectId}`);

  if (!taskContainer) return;

  taskContainer.innerHTML = "";

  tasks.forEach((task) => {

    if (
  currentFilter !== "All" &&
  task.status !== currentFilter
) {
  return;
}

    taskContainer.innerHTML += `
      <div class="task-card">

        <!-- TASK TITLE -->
        <p>${task.title}</p>

        <!-- STATUS -->
        <p>
          <strong style="
            color:
              ${task.status === "Done" ? "green" :
                task.status === "In Progress" ? "orange" :
                "gray"}
          ">
            ${task.status}
          </strong>
        </p>

        <!-- ACTION BUTTONS -->
        <div class="task-actions">

          <button class="status-btn"
            data-task="${task._id}"
            data-status="To Do"
            data-project="${projectId}">
            To Do
          </button>

          <button class="status-btn"
            data-task="${task._id}"
            data-status="In Progress"
            data-project="${projectId}">
            In Progress
          </button>

          <button class="status-btn"
            data-task="${task._id}"
            data-status="Done"
            data-project="${projectId}">
            Done
          </button>

          <button class="delete-btn"
            data-task="${task._id}"
            data-project="${projectId}">
            Delete
          </button>

        </div>

      </div>
    `;
  });
  updateProgress(projectId, tasks);
}


// EVENT LISTENER (BUTTON HANDLING)
document.addEventListener("click", async (e) => {

  const btn = e.target.closest("button");

  if (!btn) return;

  // STATUS BUTTON
  if (btn.classList.contains("status-btn")) {

    const taskId = btn.dataset.task;
    const status = btn.dataset.status;
    const projectId = btn.dataset.project;

    await updateStatus(taskId, status, projectId);
  }

  // DELETE BUTTON
  if (btn.classList.contains("delete-btn")) {

    const taskId = btn.dataset.task;
    const projectId = btn.dataset.project;

    await deleteTask(taskId, projectId);
  }
});


// UPDATE STATUS
async function updateStatus(taskId, status, projectId) {

  const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  alert(data.message);

  loadTasks(projectId);
}


// DELETE TASK
async function deleteTask(taskId, projectId) {

  const confirmDelete = confirm("Are you sure you want to delete this task?");

  if (!confirmDelete) return;

  const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: "DELETE",
  });

  const data = await res.json();

  alert(data.message);

  loadTasks(projectId);
}

//remembers selected filters and reloads tasks
function setFilter(status) {

  currentFilter = status;

  loadProjects();
}

//progress bar addition
function updateProgress(projectId, tasks) {

  const total = tasks.length;

  const done = tasks.filter(t => t.status === "Done").length;

  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const bar = document.getElementById(`progress-${projectId}`);
  const text = document.getElementById(`progress-text-${projectId}`);

  if (bar) {
    bar.style.width = percent + "%";
  }

  if (text) {
    text.innerText = `${percent}%`;
  }
}

//logout button functionality
function logout() {
  localStorage.removeItem("token");
  alert("Logged out successfully");
  window.location.href = "login.html";
}

// INIT
loadProjects();