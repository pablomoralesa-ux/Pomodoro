document.addEventListener('DOMContentLoaded', () => {
  window.app = new PomoAdoro();
  const app = window.app;

  document.getElementById('themeToggle')?.addEventListener('click', () => app.toggleTheme());
  document.getElementById('meetingToggle')?.addEventListener('click', () => app.toggleMeetingMode());
  document.getElementById('feedbackToggle')?.addEventListener('click', () => app.openFeedback());
  document.getElementById('editMoodBtn')?.addEventListener('click', () => app.showMoodModal());
  document.getElementById('resetPomodorosBtn')?.addEventListener('click', () => app.resetPomodoros());
  document.getElementById('resetTasksBtn')?.addEventListener('click', () => app.resetTasksCompleted());
  document.getElementById('soundsToggle')?.addEventListener('click', () => app.toggleSoundsSection());
  document.getElementById('closeMessageBtn')?.addEventListener('click', () => app.closePersonalizedMessage());
  document.getElementById('closeBreathingBtn')?.addEventListener('click', () => app.closeBreathingModal());
});
