 class Todolist {
  constructor(title, description, date, priority) {
    this.id = Date.now();
    this.title = title;
    this.description = description;
    this.date = date;
    this.priority = priority;
  }
}

 class Inbox {
  constructor() {
    this.tasks = [];
  }
  addTask(title, description, date, priority) {
    const newTask = new Todolist(title, description, date, priority);
    this.tasks.push(newTask);
  }
  removeTask(date) {
    this.tasks = this.tasks.filter((task) => task.date !== date);
  }
  clear() {
    this.tasks = [];
  }
}
