export function createForm() {
  const form = document.createElement("form");
  const header = document.createElement("div");
  const title = document.createElement("h2");
  const closeBtn = document.createElement("button");
  const formContainer = document.createElement("div");
  
  const sidebar = document.createElement("div");
  const sidebarLabel = document.createElement("span");
  
  const contentWrapper = document.createElement("div");
  
  const titleInput = document.createElement("input");
  const detailsInput = document.createElement("textarea");
  
  const dateLabel = document.createElement("label");
  const dateInput = document.createElement("input");
  
  const priorityLabel = document.createElement("label");
  const priorityContainer = document.createElement("div");
  
  const submitBtn = document.createElement("button");
 
  // Set content
  title.textContent = "Create a new...";
  closeBtn.innerHTML = "✕";
  closeBtn.type = "button";
  closeBtn.className = "close-btn";
  
  sidebarLabel.textContent = "// To Do";
  
  titleInput.type = "text";
  titleInput.placeholder = "Title: Pay bills";
  
  detailsInput.placeholder = "Details: e.g internet, phone, rent.";
  
  dateLabel.textContent = "Due Date:";
  dateInput.type = "date";
  dateInput.className = "date-input";
  
  priorityLabel.textContent = "Priority:";
  
  // Create priority buttons
  const priorities = [
    { label: "LOW", color: "low" },
    { label: "MEDIUM", color: "medium" },
    { label: "HIGH", color: "high" }
  ];
  
  priorities.forEach(({ label, color }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.className = `priority-btn priority-${color}`;
    btn.dataset.priority = label.toLowerCase();
    priorityContainer.appendChild(btn);
  });
  
  submitBtn.type = "submit";
  submitBtn.textContent = "ADD TO DO";
  submitBtn.className = "submit-btn";
 
  // Add classes
  form.className = "todo-form modal";
  header.className = "form-header";
  formContainer.className = "form-container";
  sidebar.className = "sidebar";
  contentWrapper.className = "content-wrapper";
  titleInput.className = "title-input";
  detailsInput.className = "details-input";
  priorityContainer.className = "priority-container";
  dateLabel.className = "date-label";
  priorityLabel.className = "priority-label";
 
  // Build structure
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  sidebar.appendChild(sidebarLabel);
  
  contentWrapper.appendChild(titleInput);
  contentWrapper.appendChild(detailsInput);
  
  const dateWrapper = document.createElement("div");
  dateWrapper.className = "date-wrapper";
  dateWrapper.appendChild(dateLabel);
  dateWrapper.appendChild(dateInput);
  contentWrapper.appendChild(dateWrapper);
  
  const priorityWrapper = document.createElement("div");
  priorityWrapper.className = "priority-wrapper";
  priorityWrapper.appendChild(priorityLabel);
  priorityWrapper.appendChild(priorityContainer);
  priorityWrapper.appendChild(submitBtn);
  contentWrapper.appendChild(priorityWrapper);
  
  formContainer.appendChild(sidebar);
  formContainer.appendChild(contentWrapper);
  
  form.appendChild(header);
  form.appendChild(formContainer);
 
  document.body.appendChild(form);
 
  return {
    form,
    titleInput,
    detailsInput,
    dateInput,
    priorityBtns: priorityContainer.querySelectorAll(".priority-btn"),
    submitBtn,
    closeBtn,
    priorityContainer
  };
}