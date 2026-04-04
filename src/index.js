import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style.css";

const btnCreatNewTask = document.querySelector(".btnSidebar");
const listOfTasks = document.querySelector(".contentTaskes");
const formList = document.querySelector(".form");
const submitForm = document.querySelector("#submit");

function showForm(){
  formList.classList.add("show");
}
function hideForm(){
  formList.classList.add("hide");
}
btnCreatNewTask.addEventListener("click",showForm);
submitForm.addEventListener("click",hideForm);