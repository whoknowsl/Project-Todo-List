import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style.css";
import { createform } from "./form.js";
import { Todolist } from "./data.js";
import { Inbox } from "./data.js";
const formData = createform();

const btnNewTask = document.querySelector("#sidebar-add-task");
const addTaskContent = document.querySelector("#addTaskContent");
const btnAddInbox = document.querySelector(".add");
const content = document.querySelector(".content");
const inbox = new Inbox();
btnNewTask.addEventListener("click", showForm);
addTaskContent.addEventListener("click", createform);
function showForm() {
  formData.form.classList.remove("hidden");
}
function hideForm() {
  formData.form.classList.add("hidden");
}
formData.cancel.addEventListener("click", () => {
  hideForm();
  formData.form.reset(); // Clear the form inputs
});