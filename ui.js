/**
 * Renders task list and timer display on the page.
 */
export default class UI {
  constructor(taskListEl, timerEl) {
    this.taskListEl = taskListEl;
    this.timerEl = timerEl;
  }

  renderTasks(tasks, handlers) {
    this.taskListEl.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', () => handlers.onToggle(task.id));

      const span = document.createElement('span');
      span.textContent = task.text;

      const del = document.createElement('button');
      del.textContent = '✖';
      del.addEventListener('click', () => handlers.onRemove(task.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(del);
      this.taskListEl.appendChild(li);
    });
  }

  updateTimer(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    this.timerEl.textContent = `${m}:${s}`;
  }
}
