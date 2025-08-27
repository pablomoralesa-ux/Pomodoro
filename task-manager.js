/**
 * Handles creation and manipulation of task items.
 */
export default class TaskManager {
  constructor() {
    this.tasks = [];
    this.idCounter = 0;
  }

  addTask(text) {
    const task = { id: this.idCounter++, text, done: false };
    this.tasks.push(task);
    return task;
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.done = !task.done;
    }
  }

  removeTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  getTasks() {
    return [...this.tasks];
  }
}
