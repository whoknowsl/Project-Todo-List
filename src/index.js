import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style.css";
import { createForm } from "./form.js"; // ✅ FIX: camelCase
import { Todolist } from "./data.js";
import { Inbox } from "./data.js";
 
// ✅ FIX: Call createForm() to get the form object
const formData = createForm();
 
const btnNewTask = document.querySelector("#sidebar-add-task");
const addTaskContent = document.querySelector("#addTaskContent");
const btnAddInbox = document.querySelector(".add");
const content = document.querySelector(".content");
const inbox = new Inbox();
 
// ✅ Open form when "Add Task" button is clicked
btnNewTask.addEventListener("click", showForm);
 
// ✅ Close form when close button is clicked
formData.closeBtn.addEventListener("click", hideForm);
 
// Show/Hide functions
function showForm() {
  formData.form.classList.remove("hidden");
}
 
function hideForm() {
  formData.form.classList.add("hidden");
}
 
// ✅ FIX: Submit button handler
formData.submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  
  // Get form values
  const title = formData.titleInput.value;
  const details = formData.detailsInput.value;
  const dueDate = formData.dateInput.value;
  
  // Get selected priority
  let selectedPriority = "low";
  formData.priorityBtns.forEach(btn => {
    if (btn.classList.contains("active")) {
      selectedPriority = btn.dataset.priority;
    }
  });
  
  console.log({
    title,
    details,
    dueDate,
    priority: selectedPriority
  });
  
  // TODO: Add task to inbox
  // inbox.addTask(title, details, dueDate, selectedPriority);
  
  // Reset form and hide
  formData.form.reset();
  formData.priorityBtns.forEach(btn => btn.classList.remove("active"));
  hideForm();
});
 
// ✅ Handle priority button selection
formData.priorityBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    // Remove active from all buttons
    formData.priorityBtns.forEach(b => b.classList.remove("active"));
    // Add active to clicked button
    btn.classList.add("active");
  });
});