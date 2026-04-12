import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style.css";

const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.querySelector(".tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

//creating the array where to store and display taskes
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

//the functions
const removeSpecialChars = (val) => {
  return val.trim().replace(/[^A-Za-z0-9\-\s]/g, "");
};
const addOrUpdateTask = () => {
  if (!titleInput.value.trim()) {
    alert("Please provide a title");
    return;
  }
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${removeSpecialChars(titleInput.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: removeSpecialChars(titleInput.value),
    date: dateInput.value,
    description: descriptionInput.value,
  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }
  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
};
const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  taskData.forEach(({ id, title, date, description }) => {
    tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
        </div>
      `;
  });
};
const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id,
  );

  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
};
const editTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id,
  );

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerText = "Update Task";

  taskForm.classList.toggle("hidden");
};

const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
};
if (taskData.length) {
  updateTaskContainer();
}
//adding the function to the logic
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden"),
);
closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues =
    titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated =
    titleInput.value !== currentTask.title ||
    dateInput.value !== currentTask.date ||
    descriptionInput.value !== currentTask.description;
  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});
cancelBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
});
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

//pervent taskform from reffreching
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateTask();
});
//window.editTask = editTask;
window.editTask = editTask;
window.deleteTask = deleteTask;

const closeProjectBtn = document.getElementById("close-project-form-btn");
const openProjectBtn = document.getElementById("open-project-form-btn");
const projectForm = document.getElementById("project-form");
openProjectBtn.addEventListener("click", () => {
  projectForm.classList.toggle("hidden");
});

closeProjectBtn.addEventListener("click",()=>{
 
})