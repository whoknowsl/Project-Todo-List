export function createform() {
  const form = document.createElement("form");
  const legend = document.createElement("legend");
  const titleInput = document.createElement("input");
  const descrptionInput = document.createElement("textarea");
  const dateInput = document.createElement("input");
  const prioretySelecte = document.createElement("select");
  const placeholder = document.createElement("option");
  const opt1 = document.createElement("option");
  const opt2 = document.createElement("option");
  const opt3 = document.createElement("option");
  const submit = document.createElement("input");
  const cancel = document.createElement("input");

  legend.textContent = "create todo";
  opt1.textContent = "High Priority 🔴";
  opt2.textContent = "Priority 2 🟠";
  opt3.textContent = "Priority 3 🔵";
  placeholder.textContent = "Select a priority...";

  titleInput.placeholder = "Enter task title...";
  descrptionInput.placeholder = `"Details: e.g internet, phone, rent.`;
  placeholder.value = "";

  dateInput.type = "date";
  titleInput.type = "text";
  submit.type = "submit";
  cancel.type = "reset";

  placeholder.disabled = true; // User can't click it again
  placeholder.selected = true; // Shows up first

  form.classList.add("popup-box");
  form.classList.add("hidden");
  titleInput.classList.add("titleInput");
  descrptionInput.classList.add("descrptionInput");

  form.appendChild(legend);
  form.appendChild(titleInput);
  form.appendChild(descrptionInput);
  form.appendChild(dateInput);
  form.appendChild(prioretySelecte);
  form.appendChild(submit);
  form.appendChild(cancel);
  prioretySelecte.appendChild(placeholder);
  prioretySelecte.appendChild(opt1);
  prioretySelecte.appendChild(opt2);
  prioretySelecte.appendChild(opt3);

  document.body.append(form);

  return {
    form,
    titleInput,
    descrptionInput,
    dateInput,
    prioretySelecte,
    submit,
    cancel,
  };
}
