import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style.css";

// ===== STORAGE MANAGER CLASS =====
class StorageManager {
  constructor() {
    this.projectsKey = "projects";
    this.tasksKey = "tasks";
  }

  getProjects() {
    return JSON.parse(localStorage.getItem(this.projectsKey)) || [];
  }

  saveProjects(projects) {
    localStorage.setItem(this.projectsKey, JSON.stringify(projects));
  }

  getTasks() {
    return JSON.parse(localStorage.getItem(this.tasksKey)) || [];
  }

  saveTasks(tasks) {
    localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
  }

  clearAll() {
    localStorage.removeItem(this.projectsKey);
    localStorage.removeItem(this.tasksKey);
  }
}

// ===== UTILITY CLASS =====
class Utils {
  static removeSpecialChars(val) {
    return val.trim().replace(/[^A-Za-z0-9\-\s]/g, "");
  }

  static generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ===== PROJECT CLASS =====
class Project {
  constructor(title) {
    this.id = Utils.generateId();
    this.title = Utils.removeSpecialChars(title);
    this.createdAt = new Date().toISOString();
  }

  static fromJSON(data) {
    const project = Object.create(Project.prototype);
    return Object.assign(project, data);
  }
}

// ===== TASK CLASS =====
class Task {
  // ✅ added priority param
  constructor(title, date, description, projectId, priority) {
    this.id = Utils.generateId();
    this.projectId = projectId;
    this.title = Utils.removeSpecialChars(title);
    this.date = date;
    this.description = description;
    this.priority = priority || "medium"; // ✅ default to medium
  }

  static fromJSON(data) {
    const task = Object.create(Task.prototype);
    return Object.assign(task, data);
  }

  update(title, date, description, priority) {
    this.title = Utils.removeSpecialChars(title);
    this.date = date;
    this.description = description;
    this.priority = priority || "medium"; // ✅ update priority
  }
}

// ===== PROJECT MANAGER CLASS =====
class ProjectManager {
  constructor(storage) {
    this.storage = storage;
    this.projects = this.loadProjects();
  }

  loadProjects() {
    return this.storage.getProjects().map((data) => Project.fromJSON(data));
  }

  addProject(title) {
    if (!title.trim()) {
      throw new Error("Please provide a project name");
    }
    const project = new Project(title);
    this.projects.push(project);
    this.save();
    return project;
  }

  deleteProject(projectId) {
    const index = this.projects.findIndex((p) => p.id === projectId);
    if (index > -1) {
      this.projects.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  getProjectById(projectId) {
    return this.projects.find((p) => p.id === projectId);
  }

  getAll() {
    return this.projects;
  }

  save() {
    this.storage.saveProjects(this.projects);
  }
}

// ===== TASK MANAGER CLASS =====
class TaskManager {
  constructor(storage) {
    this.storage = storage;
    this.tasks = this.loadTasks();
  }

  loadTasks() {
    return this.storage.getTasks().map((data) => Task.fromJSON(data));
  }

  addTask(title, date, description, projectId, priority) {
    if (!title.trim()) {
      throw new Error("Please provide a title");
    }
    // ✅ allow "general" as a valid projectId (no project needed)
    const resolvedProjectId = projectId || "general";
    const task = new Task(title, date, description, resolvedProjectId, priority);
    this.tasks.unshift(task);
    this.save();
    return task;
  }

  // ✅ priority is now updated too
  updateTask(taskId, title, date, description, priority) {
    const task = this.getTaskById(taskId);
    if (task) {
      task.update(title, date, description, priority); // ✅
      this.save();
      return task;
    }
    return null;
  }

  deleteTask(taskId) {
    const index = this.tasks.findIndex((t) => t.id === taskId);
    if (index > -1) {
      this.tasks.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  getTaskById(taskId) {
    return this.tasks.find((t) => t.id === taskId);
  }

  getTasksByProject(projectId) {
    return this.tasks.filter((t) => t.projectId === projectId);
  }

  // ✅ returns tasks with no project (general)
  getGeneralTasks() {
    return this.tasks.filter((t) => t.projectId === "general");
  }

  deleteTasksByProject(projectId) {
    this.tasks = this.tasks.filter((t) => t.projectId !== projectId);
    this.save();
  }

  getAll() {
    return this.tasks;
  }

  save() {
    this.storage.saveTasks(this.tasks);
  }
}

// ===== UI CLASS =====
class UI {
  constructor() {
    // Task form elements
    this.taskForm = document.getElementById("task-form");
    this.titleInput = document.getElementById("title-input");
    this.dateInput = document.getElementById("date-input");
    this.descriptionInput = document.getElementById("description-input");
    this.priorityInput = document.getElementById("priority-input"); // ✅
    this.addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
    this.openTaskFormBtn = document.getElementById("open-task-form-btn");
    this.closeTaskFormBtn = document.getElementById("close-task-form-btn");
    this.tasksContainer = document.querySelector(".tasks-container");
    this.generalTasksContainer = document.querySelector(".general-tasks-container"); // ✅

    // Project form elements
    this.projectForm = document.getElementById("project-form");
    this.titleProjectInput = document.getElementById("project-title-input");
    this.addProjectBtn = document.getElementById("add-or-update-task-project-btn");
    this.openProjectBtn = document.getElementById("open-project-form-btn");
    this.closeProjectBtn = document.getElementById("close-project-form-btn");
    this.projectSideBar = document.getElementById("projets");

    // Dialog elements
    this.confirmCloseDialog = document.getElementById("confirm-close-dialog");
    this.cancelBtn = document.getElementById("cancel-btn");
    this.discardBtn = document.getElementById("discard-btn");
  }

  // Task Form Methods
  openTaskForm() {
    this.taskForm.classList.remove("hidden");
  }

  closeTaskForm() {
    this.resetTaskForm();
  }

  resetTaskForm() {
    this.titleInput.value = "";
    this.dateInput.value = "";
    this.descriptionInput.value = "";
    this.priorityInput.value = "medium"; // ✅ reset to medium
    this.taskForm.classList.add("hidden");
    this.addOrUpdateTaskBtn.innerText = "Add Task";
  }

  showTaskFormForEdit() {
    this.addOrUpdateTaskBtn.innerText = "Update Task";
    this.taskForm.classList.remove("hidden");
  }

  getTaskFormData() {
    return {
      title: this.titleInput.value,
      date: this.dateInput.value,
      description: this.descriptionInput.value,
      priority: this.priorityInput.value, // ✅
    };
  }

  setTaskFormData(task) {
    this.titleInput.value = task.title;
    this.dateInput.value = task.date;
    this.descriptionInput.value = task.description;
    this.priorityInput.value = task.priority || "medium"; // ✅
  }

  // Project Form Methods
  openProjectForm() {
    this.projectForm.classList.remove("-hidden");
  }

  closeProjectForm() {
    this.projectForm.classList.add("-hidden");
    this.titleProjectInput.value = "";
  }

  getProjectFormData() {
    return this.titleProjectInput.value;
  }

  // Tasks Container Methods
  renderTasks(tasks) {
    this.tasksContainer.innerHTML = "";

    if (tasks.length === 0) {
      this.tasksContainer.innerHTML =
        '<p class="no-tasks-message">No tasks yet. Create one!</p>';
      return;
    }

    tasks.forEach((task) => {
      const taskEl = this.createTaskElement(task);
      this.tasksContainer.appendChild(taskEl);
    });
  }

  createTaskElement(task) {
    const taskEl = document.createElement("div");
    taskEl.className = `task priority-${task.priority || "medium"}`;
    taskEl.id = task.id;
    taskEl.innerHTML = `
      <div class="task-content">
        <p style="font-weight:600;font-size:0.95rem;margin-bottom:4px;">${task.title}</p>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          ${task.date ? `<span style="font-size:0.78rem;color:var(--text-muted);">📅 ${task.date}</span>` : ""}
          <span class="priority-badge ${task.priority || "medium"}">${task.priority || "medium"}</span>
        </div>
        ${task.description ? `<p style="font-size:0.85rem;color:var(--text-secondary);margin-top:6px;line-height:1.5;">${task.description}</p>` : ""}
      </div>
      <div class="task-actions">
        <button onclick="app.handleEditTask('${task.id}')" type="button" class="edit-btn">Edit</button>
        <button onclick="app.handleDeleteTask('${task.id}')" type="button" class="delete-btn">Delete</button>
      </div>
    `;
    return taskEl;
  }

  showNoProjectMessage() {
    this.tasksContainer.innerHTML =
      '<p class="no-project-message">Please select a project to view tasks</p>';
  }

  // ✅ renders general tasks in the general container
  renderGeneralTasks(tasks) {
    this.generalTasksContainer.innerHTML = "";

    if (tasks.length === 0) {
      this.generalTasksContainer.innerHTML =
        '<p class="no-tasks-message">No general tasks yet. Create one!</p>';
      return;
    }

    tasks.forEach((task) => {
      const taskEl = this.createTaskElement(task);
      this.generalTasksContainer.appendChild(taskEl);
    });
  }

  // Projects Methods
  renderProjects(projects, activeProjectId = null) {
    this.projectSideBar.innerHTML = "";

    // ✅ always show General at the top
    const generalEl = document.createElement("div");
    generalEl.className = `project-item ${activeProjectId === "general" ? "active" : ""}`;
    generalEl.id = "project-general";
    generalEl.innerHTML = `
      <button class="project-btn" onclick="app.handleSelectProject('general')" type="button">
        📋 General
      </button>
    `;
    this.projectSideBar.appendChild(generalEl);

    if (projects.length === 0) {
      this.projectSideBar.innerHTML =
        '<p class="no-projects-message">No projects yet</p>';
      return;
    }

    projects.forEach((project) => {
      const projectEl = this.createProjectElement(project, activeProjectId);
      this.projectSideBar.appendChild(projectEl);
    });
  }

  createProjectElement(project, activeProjectId) {
    const projectEl = document.createElement("div");
    projectEl.className = `project-item ${
      project.id === activeProjectId ? "active" : ""
    }`;
    projectEl.id = `project-${project.id}`;
    projectEl.innerHTML = `
      <button class="project-btn" onclick="app.handleSelectProject('${project.id}')" type="button">
        ${project.title}
      </button>
      <button class="project-delete-btn" onclick="app.handleDeleteProject('${project.id}')" type="button" title="Delete project">
        ×
      </button>
    `;
    return projectEl;
  }

  // Dialog Methods
  showConfirmDialog() {
    this.confirmCloseDialog.showModal();
  }

  closeConfirmDialog() {
    this.confirmCloseDialog.close();
  }

  hasFormChanges(originalTask) {
    const formData = this.getTaskFormData();
    return (
      formData.title !== originalTask.title ||
      formData.date !== originalTask.date ||
      formData.description !== originalTask.description ||
      formData.priority !== originalTask.priority // ✅
    );
  }

  hasFormData() {
    const formData = this.getTaskFormData();
    return (
      formData.title.trim() ||
      formData.date.trim() ||
      formData.description.trim()
    );
  }
}

// ===== APP CLASS (Main Controller) =====
class TodoApp {
  constructor() {
    this.storage = new StorageManager();
    this.projectManager = new ProjectManager(this.storage);
    this.taskManager = new TaskManager(this.storage);
    this.ui = new UI();

    this.currentProjectId = null;
    this.currentTask = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderInitialState();
  }

  setupEventListeners() {
    this.ui.openTaskFormBtn.addEventListener("click", () =>
      this.handleOpenTaskForm()
    );
    this.ui.closeTaskFormBtn.addEventListener("click", () =>
      this.handleCloseTaskForm()
    );
    this.ui.taskForm.addEventListener("submit", (e) =>
      this.handleSubmitTask(e)
    );

    this.ui.openProjectBtn.addEventListener("click", () =>
      this.ui.openProjectForm()
    );
    this.ui.closeProjectBtn.addEventListener("click", () =>
      this.ui.closeProjectForm()
    );
    this.ui.addProjectBtn.addEventListener("click", (e) =>
      this.handleAddProject(e)
    );
    this.ui.projectForm.addEventListener("submit", (e) =>
      this.handleAddProject(e)
    );

    this.ui.cancelBtn.addEventListener("click", () =>
      this.ui.closeConfirmDialog()
    );
    this.ui.discardBtn.addEventListener("click", () =>
      this.handleDiscardChanges()
    );
  }

  renderInitialState() {
    const projects = this.projectManager.getAll();
    this.ui.renderProjects(projects);
    // ✅ start on General by default
    this.currentProjectId = "general";
    this.refreshTasks();
    this.refreshProjects();
  }

  // Task Handlers
  handleOpenTaskForm() {
    // ✅ no longer required to have a project selected
    this.currentTask = null;
    this.ui.openTaskForm();
  }

  handleCloseTaskForm() {
    if (
      this.ui.hasFormData() &&
      this.currentTask &&
      this.ui.hasFormChanges(this.currentTask)
    ) {
      this.ui.showConfirmDialog();
    } else if (this.ui.hasFormData() && !this.currentTask) {
      this.ui.showConfirmDialog();
    } else {
      this.ui.closeTaskForm();
    }
  }

  handleSubmitTask(e) {
    e.preventDefault();

    try {
      const formData = this.ui.getTaskFormData();

      if (this.currentTask) {
        // ✅ pass priority to updateTask
        this.taskManager.updateTask(
          this.currentTask.id,
          formData.title,
          formData.date,
          formData.description,
          formData.priority
        );
      } else {
        // ✅ pass priority to addTask
        this.taskManager.addTask(
          formData.title,
          formData.date,
          formData.description,
          this.currentProjectId,
          formData.priority
        );
      }

      this.refreshTasks();
      this.ui.closeTaskForm();
    } catch (error) {
      alert(error.message);
    }
  }

  handleEditTask(taskId) {
    this.currentTask = this.taskManager.getTaskById(taskId);
    if (this.currentTask) {
      this.ui.setTaskFormData(this.currentTask);
      this.ui.showTaskFormForEdit();
    }
  }

  handleDeleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
      this.taskManager.deleteTask(taskId);
      this.refreshTasks();
    }
  }

  handleDiscardChanges() {
    this.ui.closeConfirmDialog();
    this.ui.closeTaskForm();
  }

  // Project Handlers
  handleAddProject(e) {
    e.preventDefault();

    try {
      const projectName = this.ui.getProjectFormData();
      this.projectManager.addProject(projectName);
      this.ui.closeProjectForm();
      this.refreshProjects();
    } catch (error) {
      alert(error.message);
    }
  }

  handleSelectProject(projectId) {
    this.currentProjectId = projectId;
    this.currentTask = null;
    this.refreshTasks();
    this.refreshProjects();
  }

  handleDeleteProject(projectId) {
    if (
      confirm("Are you sure you want to delete this project and all its tasks?")
    ) {
      this.taskManager.deleteTasksByProject(projectId);
      this.projectManager.deleteProject(projectId);

      if (this.currentProjectId === projectId) {
        this.currentProjectId = null;
        this.ui.showNoProjectMessage();
      }

      this.refreshProjects();
      this.refreshTasks();
    }
  }

  // Refresh Methods
  refreshTasks() {
    if (!this.currentProjectId) {
      this.ui.showNoProjectMessage();
      return;
    }
    // ✅ use getGeneralTasks for general, otherwise filter by project
    const tasks = this.currentProjectId === "general"
      ? this.taskManager.getGeneralTasks()
      : this.taskManager.getTasksByProject(this.currentProjectId);
    this.ui.renderTasks(tasks);
  }

  refreshProjects() {
    const projects = this.projectManager.getAll();
    this.ui.renderProjects(projects, this.currentProjectId);
  }

  handleEditTask = this.handleEditTask.bind(this);
  handleDeleteTask = this.handleDeleteTask.bind(this);
  handleSelectProject = this.handleSelectProject.bind(this);
  handleDeleteProject = this.handleDeleteProject.bind(this);
}

// ===== INITIALIZE APP =====
const app = new TodoApp();
window.app = app;