const openProjectBtn = document.getElementById("open-project-form-btn");
const projectForm = document.getElementById("project-form");
openProjectBtn.addEventListener("click", () => {
  projectForm.classList.toggle("hidden");
});
