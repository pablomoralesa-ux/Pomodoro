/**
 * Main application that wires timer, task manager and UI.
 */
import Timer from './timer.js';
import TaskManager from './task-manager.js';
import UI from './ui.js';

const DEFAULT_DURATION = 25 * 60;

const taskListEl = document.getElementById('tasks');
const timerEl = document.getElementById('time');

const ui = new UI(taskListEl, timerEl);
const taskManager = new TaskManager();
const timer = new Timer(DEFAULT_DURATION, {
  onTick: seconds => ui.updateTimer(seconds),
  onComplete: () => alert('¡Tiempo!')
});

const handlers = {
  onToggle: id => {
    taskManager.toggleTask(id);
    ui.renderTasks(taskManager.getTasks(), handlers);
  },
  onRemove: id => {
    taskManager.removeTask(id);
    ui.renderTasks(taskManager.getTasks(), handlers);
  }
};

document.getElementById('startBtn').addEventListener('click', () => timer.start());
document.getElementById('pauseBtn').addEventListener('click', () => timer.pause());
document.getElementById('resetBtn').addEventListener('click', () => timer.reset(DEFAULT_DURATION));

const form = document.getElementById('addTaskForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;
  taskManager.addTask(text);
  input.value = '';
  ui.renderTasks(taskManager.getTasks(), handlers);
});

ui.updateTimer(DEFAULT_DURATION);
ui.renderTasks(taskManager.getTasks(), handlers);
