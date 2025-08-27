        // Version: 2.1.1 - WordPress Compatible
        console.log('Pomo Adoro v2.1.1 loaded - WordPress Compatible');
        
        // Ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
        
        function initializeApp() {
            window.app = new PomoAdoro();
        }
        
        class PomoAdoro {
            constructor() {
                this.modes = {
                    pomodoro: { duration: 25 * 60, label: 'Pomodoro' },
                    short: { duration: 5 * 60, label: 'Descanso Corto' },
                    long: { duration: 10 * 60, label: 'Descanso Largo' }
                };
                
                this.currentMode = 'pomodoro';
                this.timeLeft = this.modes[this.currentMode].duration;
                this.isRunning = false;
                this.timer = null;
                this.pomodoroCount = 0;
                this.tasksCompleted = 0;
                this.tasks = [];
                this.taskIdCounter = 0;
                this.originalTitle = document.title;
                this.currentSound = null;
                this.soundVolume = 0.2;
                this.audioContext = null;
                this.soundNodes = {};
                this.currentMood = null;
                this.selectedMoodOption = null;
                this.persistenceDuration = 24; // horas por defecto
                this.autoSaveInterval = null;
                this.isDarkMode = false;
                this.toastTimeout = null;



                
                // Breathing properties
                this.currentBreathingTechnique = null;
                this.breathingTimer = null;
                this.breathingActive = false;
                this.breathingPhase = 'prepare';
                this.breathingCycleCount = 0;
                this.breathingDuration = 3; // minutes
                this.breathingAmbientSound = null;
                
                // Meeting mode properties
                this.meetingMode = {
                    active: false,
                    startTime: null,
                    duration: 30,
                    parkingLot: []
                };
                
                this.moodData = {
                    happy: { emoji: '😊', label: 'Bien' },
                    neutral: { emoji: '😐', label: 'Neutro' },
                    tired: { emoji: '😞', label: 'Cansado/a' },
                    anxious: { emoji: '😰', label: 'Ansioso/a' },
                    frustrated: { emoji: '😡', label: 'Frustrado/a' }
                };
                
                this.breathingTechniques = {
                    '478': {
                        name: '4-7-8',
                        description: 'Inhala 4, mantén 7, exhala 8',
                        phases: [
                            { name: 'inhale', duration: 4, instruction: 'Inhala por 4' },
                            { name: 'hold', duration: 7, instruction: 'Mantén por 7' },
                            { name: 'exhale', duration: 8, instruction: 'Exhala por 8' }
                        ],
                        cycleTime: 19,
                        benefits: 'Ideal para relajación y reducir ansiedad'
                    },
                    'box': {
                        name: 'Respiración en Caja',
                        description: 'Inhala 4, mantén 4, exhala 4, mantén 4',
                        phases: [
                            { name: 'inhale', duration: 4, instruction: 'Inhala por 4' },
                            { name: 'hold', duration: 4, instruction: 'Mantén por 4' },
                            { name: 'exhale', duration: 4, instruction: 'Exhala por 4' },
                            { name: 'hold', duration: 4, instruction: 'Mantén por 4' }
                        ],
                        cycleTime: 16,
                        benefits: 'Perfecto para concentración y equilibrio'
                    },
                    'energizing': {
                        name: 'Respiración Energizante',
                        description: 'Inhala 2, exhala 4 (rápido)',
                        phases: [
                            { name: 'inhale', duration: 2, instruction: 'Inhala rápido por 2' },
                            { name: 'exhale', duration: 4, instruction: 'Exhala por 4' }
                        ],
                        cycleTime: 6,
                        benefits: 'Aumenta energía y alerta mental'
                    },
                    'coherence': {
                        name: 'Coherencia Cardíaca',
                        description: 'Inhala 5, exhala 5',
                        phases: [
                            { name: 'inhale', duration: 5, instruction: 'Inhala por 5' },
                            { name: 'exhale', duration: 5, instruction: 'Exhala por 5' }
                        ],
                        cycleTime: 10,
                        benefits: 'Equilibra el sistema nervioso'
                    }
                };
                
                this.motivationalPhrases = {
                    happy: [
                        "¡Excelente energía! Sigue así 🌟",
                        "Tu actitud positiva es contagiosa 😊",
                        "¡Aprovecha este buen momento! 🚀",
                        "Con esta energía puedes lograr todo 💪"
                    ],
                    neutral: [
                        "Paso a paso, vas muy bien 👣",
                        "La constancia es tu mejor aliada 🎯",
                        "Cada Pomodoro cuenta 🍅",
                        "¡Sigue construyendo tu éxito! 🏗️"
                    ],
                    tired: [
                        "Descansa cuando lo necesites 💤",
                        "Pequeños pasos también cuentan 🐌",
                        "Tu esfuerzo es valioso, incluso hoy 💙",
                        "Tómate el tiempo que necesites ⏰"
                    ],
                    anxious: [
                        "Respira profundo, lo estás haciendo bien 🌸",
                        "Un paso a la vez, sin prisa 🧘‍♀️",
                        "Eres más fuerte de lo que crees 💪",
                        "Cada pequeño logro es importante 🌱"
                    ],
                    frustrated: [
                        "Los desafíos te hacen más fuerte 💪",
                        "Está bien sentirse así, sigue adelante 🌈",
                        "Tu perseverancia dará frutos 🌱",
                        "Mañana será un nuevo día 🌅"
                    ],
                    general: [
                        "¡Buen trabajo! Sigue así 💪",
                        "Un paso más cerca de tus metas 👣",
                        "Tú puedes con todo 🚀",
                        "¡Descansa un poco, te lo ganaste! ☕",
                        "¡Excelente concentración! 🎯",
                        "Cada Pomodoro cuenta 🍅",
                        "¡Sigue construyendo tu éxito! 🏗️",
                        "¡Productividad al máximo! ⚡"
                    ]
                };
                
                this.init();
            }
            
            init() {
                this.bindEvents();
                this.updateDisplay();
                this.setupVisibilityChange();
                this.initAudioContext();
                this.checkDailyMood();
                this.initPersistence();
                this.initSoundsSection();
                this.initTheme();
                this.initWFHFeatures();
            }
            
            bindEvents() {
                // WordPress safety checks - ensure elements exist before binding
                const startBtn = document.getElementById('startBtn');
                const pauseBtn = document.getElementById('pauseBtn');
                const resetBtn = document.getElementById('resetBtn');
                
                if (startBtn) startBtn.addEventListener('click', () => this.start());
                if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
                if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
                
                // Selector de modo
                const modeBtns = document.querySelectorAll('.mode-btn');
                if (modeBtns.length > 0) {
                    modeBtns.forEach(btn => {
                        btn.addEventListener('click', (e) => this.changeMode(e.target.dataset.mode));
                    });
                }
                
                // Tareas
                const addTaskBtn = document.getElementById('addTaskBtn');
                const taskInput = document.getElementById('taskInput');
                
                if (addTaskBtn) addTaskBtn.addEventListener('click', () => this.addTask());
                if (taskInput) {
                    taskInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') this.addTask();
                    });
                }
                
                // Delegación de eventos para inputs de edición dinámicos
                document.addEventListener('keypress', (e) => {
                    if (e.target.classList.contains('task-edit-input') && e.key === 'Enter') {
                        const taskId = parseInt(e.target.id.replace('edit-', ''));
                        this.saveTask(taskId);
                    }
                });
                
                // Atajos de teclado
                document.addEventListener('keydown', (e) => this.handleKeyboard(e));
                
                // Sonidos
                const soundBtns = document.querySelectorAll('.sound-btn');
                if (soundBtns.length > 0) {
                    soundBtns.forEach(btn => {
                        btn.addEventListener('click', (e) => this.toggleSound(e.target.closest('.sound-btn').dataset.sound));
                    });
                }
                
                // Tabs de sonidos
                const soundTabs = document.querySelectorAll('.sound-tab');
                if (soundTabs.length > 0) {
                    soundTabs.forEach(tab => {
                        tab.addEventListener('click', (e) => this.switchSoundTab(e.target.dataset.tab));
                    });
                }
                
                // Control de volumen
                const volumeSlider = document.getElementById('volumeSlider');
                if (volumeSlider) {
                    volumeSlider.addEventListener('input', (e) => this.updateVolume(e.target.value));
                }
                
                // Mood modal
                const moodOptions = document.querySelectorAll('.mood-option');
                if (moodOptions.length > 0) {
                    moodOptions.forEach(option => {
                        option.addEventListener('click', (e) => this.selectMoodOption(e.target.closest('.mood-option').dataset.mood));
                    });
                }
                
                const confirmMoodBtn = document.getElementById('confirmMoodBtn');
                if (confirmMoodBtn) {
                    confirmMoodBtn.addEventListener('click', () => this.confirmMood());
                }
                
                // Controles de persistencia
                const persistenceDuration = document.getElementById('persistenceDuration');
                const clearDataBtn2 = document.getElementById('clearDataBtn2');
                
                if (persistenceDuration) {
                    persistenceDuration.addEventListener('change', (e) => this.updatePersistenceDuration(e.target.value));
                }
                if (clearDataBtn2) {
                    clearDataBtn2.addEventListener('click', () => this.clearAllData());
                }
                
                // Breathing exercises (modal version)
                const techniqueBtns = document.querySelectorAll('.technique-btn');
                if (techniqueBtns.length > 0) {
                    techniqueBtns.forEach(btn => {
                        btn.addEventListener('click', (e) => this.selectBreathingTechnique(e.target.closest('.technique-btn').dataset.technique));
                    });
                }
                
                const startBreathingBtn = document.getElementById('startBreathingBtn');
                const stopBreathingBtn = document.getElementById('stopBreathingBtn');
                
                if (startBreathingBtn) startBreathingBtn.addEventListener('click', () => this.startBreathing());
                if (stopBreathingBtn) stopBreathingBtn.addEventListener('click', () => this.stopBreathing());
                
                // Meeting mode events
                this.bindMeetingEvents();
            }
            
            bindMeetingEvents() {
                // Meeting events - using optional chaining to prevent errors
                const startMeetingBtn = document.getElementById('startMeetingBtn');
                const pauseMeetingBtn = document.getElementById('pauseMeetingBtn');
                const endMeetingBtn = document.getElementById('endMeetingBtn');
                const addParkingBtn = document.getElementById('addParkingBtn');
                const parkingInput = document.getElementById('parkingInput');
                const convertToTasksBtn = document.getElementById('convertToTasksBtn');
                const meetingDuration = document.getElementById('meetingDuration');

                if (startMeetingBtn) startMeetingBtn.addEventListener('click', () => this.startMeeting());
                if (pauseMeetingBtn) pauseMeetingBtn.addEventListener('click', () => this.pauseMeeting());
                if (endMeetingBtn) endMeetingBtn.addEventListener('click', () => this.endMeeting());
                if (addParkingBtn) addParkingBtn.addEventListener('click', () => this.addParkingNote());
                if (parkingInput) {
                    parkingInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') this.addParkingNote();
                    });
                }
                if (convertToTasksBtn) convertToTasksBtn.addEventListener('click', () => this.convertParkingToTasks());
                if (meetingDuration) meetingDuration.addEventListener('change', (e) => this.updateMeetingDuration(e.target.value));

                // Close modals on outside click
                document.querySelectorAll('.wfh-modal').forEach(modal => {
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.classList.remove('show');
                        }
                    });
                });
            }
            

            
            handleKeyboard(e) {
                if (e.target.tagName === 'INPUT') return;
                
                switch(e.key) {
                    case ' ':
                        e.preventDefault();
                        this.isRunning ? this.pause() : this.start();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.reset();
                        break;
                    case 't':
                        e.preventDefault();
                        document.getElementById('taskInput').focus();
                        break;
                }
            }
            
            start() {
                if (!this.isRunning) {
                    this.isRunning = true;
                    this.timer = setInterval(() => this.tick(), 1000);
                    document.getElementById('startBtn').textContent = 'En Marcha';
                }
            }
            
            pause() {
                if (this.isRunning) {
                    this.isRunning = false;
                    clearInterval(this.timer);
                    document.getElementById('startBtn').textContent = 'Iniciar';
                }
            }
            
            reset() {
                this.pause();
                this.timeLeft = this.modes[this.currentMode].duration;
                this.updateDisplay();
                document.getElementById('startBtn').textContent = 'Iniciar';
            }
            
            tick() {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft <= 0) {
                    this.complete();
                }
            }
            
            complete() {
                this.pause();
                this.playCompletionSound();
                
                if (this.currentMode === 'pomodoro') {
                    this.pomodoroCount++;
                    this.updateStats();
                    
                    // Mostrar resumen del día si es el 5to pomodoro o más
                    if (this.pomodoroCount >= 5 && this.pomodoroCount % 5 === 0) {
                        this.showDailySummary();
                    }
                    
                    // Mostrar modal de transición para Pomodoro
                    this.showTransitionModal('pomodoro');
                } else {
                    // Mostrar modal de transición para descansos
                    this.showTransitionModal('break');
                }
                
                this.reset();
            }
            
            showDailySummary() {
                if (this.currentMood && this.moodData[this.currentMood]) {
                    const moodInfo = this.moodData[this.currentMood];
                    const summary = `Hoy te sentiste ${moodInfo.emoji} ${moodInfo.label} y completaste ${this.pomodoroCount} Pomodoros y ${this.tasksCompleted} tareas. ¡Excelente trabajo! 🎉`;
                    
                    setTimeout(() => {
                        this.showToast(summary);
                    }, 1000);
                }
            }
            
            showTransitionModal(type) {
                const modal = document.getElementById('transitionModal');
                const title = document.getElementById('transitionTitle');
                const message = document.getElementById('transitionMessage');
                const buttonsContainer = document.getElementById('transitionButtons');
                
                if (type === 'pomodoro') {
                    title.textContent = '🎉 ¡Pomodoro Completado!';
                    message.textContent = '¿Quieres tomar un descanso corto o largo?';
                    buttonsContainer.innerHTML = `
                        <button class="transition-btn" onclick="app.selectBreakType('short')">Descanso Corto (5 min)</button>
                        <button class="transition-btn" onclick="app.selectBreakType('long')">Descanso Largo (10 min)</button>
                        <button class="transition-btn secondary" onclick="app.closeTransitionModal()">Continuar Trabajando</button>
                    `;
                } else {
                    title.textContent = '✨ ¡Descanso Terminado!';
                    message.textContent = '¿Estás listo para empezar otro Pomodoro?';
                    buttonsContainer.innerHTML = `
                        <button class="transition-btn" onclick="app.startNewPomodoro()">¡Sí, empezar Pomodoro!</button>
                        <button class="transition-btn secondary" onclick="app.closeTransitionModal()">Más tarde</button>
                    `;
                }
                
                // Mostrar sugerencia de descanso si es necesario
                if (type === 'pomodoro') {
                    this.showBreakSuggestion();
                }
                
                modal.classList.add('show');
            }
            
            selectBreakType(breakType) {
                this.changeMode(breakType);
                this.closeTransitionModal();
                this.start();
                this.showToast(`¡${breakType === 'short' ? 'Descanso corto' : 'Descanso largo'} iniciado! 🌟`);
            }
            
            startNewPomodoro() {
                this.changeMode('pomodoro');
                this.closeTransitionModal();
                this.start();
                this.showToast('¡Nuevo Pomodoro iniciado! 🍅');
            }
            
            closeTransitionModal() {
                document.getElementById('transitionModal').classList.remove('show');
            }
            
            showBreakSuggestion() {
                const suggestions = [
                    "Estírate un poco 🚶",
                    "Toma agua 💧", 
                    "Mira por la ventana 🌤️",
                    "Haz una pausa con música 🎧",
                    "Respira profundo 🧘‍♀️",
                    "Camina un poco 👣",
                    "Descansa tus ojos 👀",
                    "Toma un snack saludable 🍎"
                ];
                
                const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                
                // Crear elemento de sugerencia
                const suggestionElement = document.createElement('div');
                suggestionElement.className = 'break-suggestion';
                suggestionElement.textContent = randomSuggestion;
                
                // Insertar antes del modal de transición
                const transitionContent = document.querySelector('.transition-content');
                transitionContent.insertBefore(suggestionElement, transitionContent.firstChild);
                
                // Remover después de 5 segundos
                setTimeout(() => {
                    if (suggestionElement.parentNode) {
                        suggestionElement.remove();
                    }
                }, 5000);
            }
            
            changeMode(mode) {
                if (mode !== this.currentMode) {
                    this.pause();
                    this.currentMode = mode;
                    this.timeLeft = this.modes[mode].duration;
                    
                    // Actualizar botones activos
                    document.querySelectorAll('.mode-btn').forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.mode === mode);
                    });
                    
                    this.updateDisplay();
                }
            }
            
            updateDisplay() {
                const minutes = Math.floor(this.timeLeft / 60);
                const seconds = this.timeLeft % 60;
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                const timeDisplay = document.getElementById('timeDisplay');
                const modeDisplay = document.getElementById('modeDisplay');
                
                if (timeDisplay) timeDisplay.textContent = timeString;
                if (modeDisplay) modeDisplay.textContent = this.modes[this.currentMode].label;
                
                // Actualizar título del navegador
                if (this.isRunning) {
                    document.title = `${timeString} - ${this.modes[this.currentMode].label}`;
                } else {
                    document.title = this.originalTitle;
                }
                
                // Actualizar círculo de progreso
                const totalTime = this.modes[this.currentMode].duration;
                const progress = (totalTime - this.timeLeft) / totalTime;
                const circumference = 2 * Math.PI * 45;
                const offset = circumference - (progress * circumference);
                
                const timerProgress = document.querySelector('.timer-progress');
                if (timerProgress) {
                    timerProgress.style.strokeDashoffset = offset;
                }
            }
            
            updateStats() {
                const pomodoroCountEl = document.getElementById('pomodoroCount');
                if (pomodoroCountEl) {
                    pomodoroCountEl.textContent = this.pomodoroCount;
                }
                
                // Agregar plantitas
                const plantsDisplay = document.getElementById('plantsDisplay');
                if (plantsDisplay) {
                    plantsDisplay.textContent = '🌱'.repeat(this.pomodoroCount);
                }
                
                this.saveData(); // Guardar automáticamente
            }
            

            
            addTask() {
                const input = document.getElementById('taskInput');
                const taskText = input.value.trim();
                
                if (taskText) {
                    const task = {
                        id: this.taskIdCounter++,
                        text: taskText,
                        completed: false,
                        priority: this.tasks.length + 1,
                        priorityLevel: 'none'
                    };
                    
                    this.tasks.push(task);
                    this.renderTasks();
                    this.saveData();
                    input.value = '';
                    
                    this.showToast('¡Tarea agregada! 📝');
                }
            }
            
            toggleTask(taskId) {
                const task = this.tasks.find(t => t.id === taskId);
                if (task) {
                    task.completed = !task.completed;
                    
                    if (task.completed) {
                        this.tasksCompleted++;
                        this.showToast(this.getRandomPhrase());
                        
                        // Mover tarea completada al final
                        this.moveTaskToEnd(taskId);
                    } else {
                        // Evitar números negativos
                        this.tasksCompleted = Math.max(0, this.tasksCompleted - 1);
                    }
                    
                    this.renderTasks();
                    this.updateTasksStats();
                    this.saveData(); // Guardar automáticamente
                }
            }
            
            deleteTask(taskId) {
                const taskIndex = this.tasks.findIndex(t => t.id === taskId);
                if (taskIndex > -1) {
                    if (this.tasks[taskIndex].completed) {
                        // Evitar números negativos
                        this.tasksCompleted = Math.max(0, this.tasksCompleted - 1);
                    }
                    this.tasks.splice(taskIndex, 1);
                    this.renderTasks();
                    this.updateTasksStats();
                    this.saveData(); // Guardar automáticamente
                }
            }
            
            editTask(taskId) {
                const task = this.tasks.find(t => t.id === taskId);
                if (task) {
                    // Cancelar cualquier otra edición en curso
                    this.tasks.forEach(t => t.editing = false);
                    
                    task.editing = true;
                    task.originalText = task.text; // Guardar texto original por si cancela
                    this.renderTasks();
                    
                    // Enfocar el input de edición
                    setTimeout(() => {
                        const editInput = document.getElementById(`edit-${taskId}`);
                        if (editInput) {
                            editInput.focus();
                            editInput.select();
                        }
                    }, 0);
                }
            }
            
            saveTask(taskId) {
                const task = this.tasks.find(t => t.id === taskId);
                const editInput = document.getElementById(`edit-${taskId}`);
                
                if (task && editInput) {
                    const newText = editInput.value.trim();
                    if (newText) {
                        task.text = newText;
                        task.editing = false;
                        delete task.originalText;
                        this.renderTasks();
                        this.saveData(); // Guardar automáticamente
                        this.showToast('¡Tarea actualizada! ✏️');
                    } else {
                        this.showToast('El texto no puede estar vacío 📝');
                    }
                }
            }
            
            cancelEdit(taskId) {
                const task = this.tasks.find(t => t.id === taskId);
                if (task) {
                    if (task.originalText !== undefined) {
                        task.text = task.originalText;
                        delete task.originalText;
                    }
                    task.editing = false;
                    this.renderTasks();
                }
            }
            
            renderTasks() {
                const container = document.getElementById('tasksList');
                container.innerHTML = '';
                
                // Sort tasks: incomplete first, then completed
                const incompleteTasks = this.tasks.filter(task => !task.completed).sort((a, b) => (a.priority || 0) - (b.priority || 0));
                const completedTasks = this.tasks.filter(task => task.completed).sort((a, b) => (a.priority || 0) - (b.priority || 0));
                const sortedTasks = [...incompleteTasks, ...completedTasks];
                
                sortedTasks.forEach((task, index) => {
                    const taskElement = document.createElement('div');
                    const priorityLevel = task.priorityLevel || 'none';
                    taskElement.className = `task-item priority-${priorityLevel}`;
                    taskElement.draggable = !task.editing;
                    taskElement.dataset.taskId = task.id;
                    
                    if (task.editing) {
                        taskElement.innerHTML = `
                            <div class="drag-handle">⋮⋮</div>
                            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                                 onclick="app.toggleTask(${task.id})"></div>
                            <input type="text" class="task-edit-input" value="${task.text}" id="edit-${task.id}">
                            <button class="save-btn" onclick="app.saveTask(${task.id})" title="Guardar">✅</button>
                            <button class="cancel-btn" onclick="app.cancelEdit(${task.id})" title="Cancelar">❌</button>
                        `;
                    } else {
                        taskElement.innerHTML = `
                            <div class="drag-handle">⋮⋮</div>
                            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                                 onclick="app.toggleTask(${task.id})"></div>
                            <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
                            <button class="edit-btn" onclick="app.editTask(${task.id})" title="Editar">✏️</button>
                            <button class="delete-btn" onclick="app.deleteTask(${task.id})" title="Eliminar">🗑️</button>
                        `;
                    }
                    
                    // Add drag and drop event listeners
                    if (!task.editing) {
                        taskElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
                        taskElement.addEventListener('dragover', (e) => this.handleDragOver(e));
                        taskElement.addEventListener('drop', (e) => this.handleDrop(e));
                        taskElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
                        taskElement.addEventListener('dragenter', (e) => this.handleDragEnter(e));
                        taskElement.addEventListener('dragleave', (e) => this.handleDragLeave(e));
                    }
                    
                    container.appendChild(taskElement);
                });
            }
            

            

            
            updateTasksStats() {
                const tasksCompletedCountEl = document.getElementById('tasksCompletedCount');
                if (tasksCompletedCountEl) {
                    tasksCompletedCountEl.textContent = this.tasksCompleted;
                }
            }
            
            showToast(message) {
                const toast = document.getElementById('toast');
                if (!toast) return; // WordPress safety check
                
                // Limpiar cualquier timeout anterior
                if (this.toastTimeout) {
                    clearTimeout(this.toastTimeout);
                }
                
                // Ocultar toast actual si está visible
                toast.classList.remove('show');
                
                // Pequeña pausa para permitir que la animación termine
                setTimeout(() => {
                    toast.textContent = message;
                    toast.classList.add('show');
                    
                    // Configurar timeout para ocultar
                    this.toastTimeout = setTimeout(() => {
                        toast.classList.remove('show');
                        
                        // Limpiar contenido después de la animación
                        setTimeout(() => {
                            if (!toast.classList.contains('show')) {
                                toast.textContent = '';
                            }
                        }, 500);
                    }, 3000);
                }, 100);
            }
            
            getRandomPhrase() {
                const phrases = this.currentMood ? this.motivationalPhrases[this.currentMood] : this.motivationalPhrases.general;
                return phrases[Math.floor(Math.random() * phrases.length)];
            }
            
            checkDailyMood() {
                const today = new Date().toDateString();
                const savedMood = localStorage.getItem('dailyMood');
                const savedDate = localStorage.getItem('moodDate');
                
                if (savedMood && savedDate === today) {
                    // Ya se registró el mood hoy
                    this.currentMood = savedMood;
                    this.displayCurrentMood();
                    this.showPersonalizedMessage();
                    this.applyMoodRecommendations();
                } else {
                    // Mostrar modal de mood
                    setTimeout(() => this.showMoodModal(), 1000);
                }
            }
            
            showMoodModal() {
                const moodModal = document.getElementById('moodModal');
                const confirmMoodBtn = document.getElementById('confirmMoodBtn');
                
                if (moodModal) moodModal.classList.add('show');
                this.selectedMoodOption = null;
                if (confirmMoodBtn) confirmMoodBtn.classList.remove('active');
                
                // Limpiar selecciones previas
                const moodOptions = document.querySelectorAll('.mood-option');
                if (moodOptions.length > 0) {
                    moodOptions.forEach(option => {
                        option.classList.remove('selected');
                    });
                }
            }
            
            selectMoodOption(mood) {
                this.selectedMoodOption = mood;
                
                // Actualizar UI
                const moodOptions = document.querySelectorAll('.mood-option');
                if (moodOptions.length > 0) {
                    moodOptions.forEach(option => {
                        option.classList.toggle('selected', option.dataset.mood === mood);
                    });
                }
                
                const confirmMoodBtn = document.getElementById('confirmMoodBtn');
                if (confirmMoodBtn) {
                    confirmMoodBtn.classList.add('active');
                }
            }
            
            confirmMood() {
                if (this.selectedMoodOption) {
                    this.currentMood = this.selectedMoodOption;
                    
                    // Guardar en localStorage
                    const today = new Date().toDateString();
                    localStorage.setItem('dailyMood', this.currentMood);
                    localStorage.setItem('moodDate', today);
                    
                    // Cerrar modal
                    const moodModal = document.getElementById('moodModal');
                    if (moodModal) {
                        moodModal.classList.remove('show');
                    }
                    
                    // Mostrar estado actual
                    this.displayCurrentMood();
                    this.showPersonalizedMessage();
                    this.applyMoodRecommendations();
                    
                    // Preguntar por respiración si el estado lo requiere
                    if (['anxious', 'tired', 'frustrated'].includes(this.currentMood)) {
                        setTimeout(() => {
                            this.showBreathingOffer();
                        }, 2000);
                    }
                    
                    this.showToast('¡Estado de ánimo registrado! 😊');
                }
            }
            

            
            displayCurrentMood() {
                if (this.currentMood && this.moodData[this.currentMood]) {
                    const moodInfo = this.moodData[this.currentMood];
                    const currentMoodEmoji = document.getElementById('currentMoodEmoji');
                    const currentMoodText = document.getElementById('currentMoodText');
                    const moodStatus = document.getElementById('moodStatus');
                    
                    if (currentMoodEmoji) currentMoodEmoji.textContent = moodInfo.emoji;
                    if (currentMoodText) currentMoodText.textContent = moodInfo.label;
                    if (moodStatus) moodStatus.style.display = 'flex';
                }
            }
            
            showPersonalizedMessage() {
                if (!this.currentMood) return;
                
                const messages = {
                    happy: "¡Qué bueno verte con tanta energía! Aprovecha este momento para ser súper productivo 🌟",
                    neutral: "Un día normal puede ser muy productivo. Vamos paso a paso 👍",
                    tired: "Entiendo que estés cansado/a. Te sugiero sesiones más cortas y descansos más largos 💤",
                    anxious: "Respira profundo. He activado sonidos relajantes para ayudarte a concentrarte 🧘‍♀️",
                    frustrated: "Los días difíciles también cuentan. Cada pequeño paso es un logro 💪"
                };
                
                const messageElement = document.getElementById('personalizedMessage');
                messageElement.innerHTML = `${messages[this.currentMood]}<button class="close-message-btn" onclick="app.closePersonalizedMessage()">×</button>`;
                messageElement.style.display = 'block';
            }

            closePersonalizedMessage() {
                const messageElement = document.getElementById('personalizedMessage');
                messageElement.style.display = 'none';
                this.showToast('Mensaje cerrado 👍');
            }

            showBreathingOffer() {
                const messages = {
                    anxious: '¿Te gustaría hacer unos ejercicios de respiración para calmar la ansiedad? 🧘‍♀️',
                    tired: '¿Quieres probar una respiración relajante para recuperar energía? 😌',
                    frustrated: '¿Te ayudo con una respiración para liberar la frustración? 💚'
                };

                const modal = document.getElementById('breathingModal');
                const subtitle = document.getElementById('breathingModalSubtitle');
                
                subtitle.textContent = messages[this.currentMood];
                modal.classList.add('show');
            }

            closeBreathingModal() {
                // Detener cualquier respiración activa
                if (this.breathingActive) {
                    this.stopBreathing();
                }
                
                // Asegurar que todos los sonidos se detengan
                this.stopBreathingAmbientSound();
                
                // Limpiar timers
                if (this.breathingTimer) {
                    clearInterval(this.breathingTimer);
                    this.breathingTimer = null;
                }
                
                // Cerrar modal
                document.getElementById('breathingModal').classList.remove('show');
                
                // Solo mostrar mensaje si no se completó la respiración
                if (!this.breathingActive && this.currentBreathingTechnique) {
                    this.showToast('Está bien, aquí estaré si cambias de opinión 😊');
                }
                
                // Resetear estado
                this.breathingActive = false;
                this.currentBreathingTechnique = null;
            }
            
            applyMoodRecommendations() {
                if (!this.currentMood) return;
                
                switch(this.currentMood) {
                    case 'tired':
                    case 'anxious':
                    case 'frustrated':
                        // Activar sonido del océano automáticamente para estados difíciles
                        setTimeout(() => {
                            if (this.currentSound !== 'ocean') {
                                this.toggleSound('ocean');
                                this.showToast('Sonido del océano activado para ayudarte a relajarte 🌊');
                            }
                        }, 2000);
                        break;
                }
            }
            
            // Notificaciones del navegador eliminadas para mejor experiencia visual
            
            setupVisibilityChange() {
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        // Cuando la página se oculta, pausar sonidos de respiración para ahorrar recursos
                        if (this.breathingActive) {
                            this.stopBreathingAmbientSound();
                        }
                        
                        if (this.isRunning && this.currentMode === 'pomodoro') {
                            setTimeout(() => {
                                if (document.hidden && this.isRunning) {
                                    // Usar toast en lugar de alert para mejor UX
                                    this.showToast('¡Vuelve al foco! 😅');
                                }
                            }, 5000); // Aumentar tiempo para evitar interrupciones frecuentes
                        }
                    } else {
                        // Cuando la página vuelve a ser visible, reanudar sonidos de respiración si estaba activa
                        if (this.breathingActive && !this.breathingAmbientSound) {
                            this.startBreathingAmbientSound();
                        }
                    }
                });
            }
            
            initAudioContext() {
                try {
                    // Verificar soporte de Web Audio API
                    if (!window.AudioContext && !window.webkitAudioContext) {
                        console.log('Web Audio API no soportada');
                        this.audioContext = null;
                        return;
                    }

                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    
                    // Manejar el estado suspended en navegadores modernos
                    if (this.audioContext.state === 'suspended') {
                        // Crear un listener global para activar el audio
                        const resumeAudio = () => {
                            if (this.audioContext && this.audioContext.state === 'suspended') {
                                this.audioContext.resume().then(() => {
                                    console.log('Audio context resumed');
                                }).catch(e => {
                                    console.error('Error resuming audio context:', e);
                                });
                            }
                        };

                        // Múltiples eventos para asegurar activación
                        document.addEventListener('click', resumeAudio, { once: true });
                        document.addEventListener('touchstart', resumeAudio, { once: true });
                        document.addEventListener('keydown', resumeAudio, { once: true });
                    }
                } catch (e) {
                    console.error('Error inicializando Web Audio API:', e);
                    this.audioContext = null;
                }
            }
            
            playCompletionSound() {
                if (!this.audioContext) return;
                
                // Crear una campanita suave
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // Configurar el sonido de campanita
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
                
                // Envelope suave
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.8);
            }
            
            createSoundGenerator(type) {
                if (!this.audioContext) return null;
                
                try {
                    const gainNode = this.audioContext.createGain();
                    if (!gainNode) return null;
                    
                    gainNode.connect(this.audioContext.destination);
                    gainNode.gain.value = this.soundVolume;
                    
                    let oscillator, noiseBuffer, source;
                    
                    switch(type) {
                        case 'white':
                            // Ruido blanco
                            noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
                            if (!noiseBuffer) return null;
                            
                            const output = noiseBuffer.getChannelData(0);
                            for (let i = 0; i < output.length; i++) {
                                output[i] = Math.random() * 2 - 1;
                            }
                            source = this.audioContext.createBufferSource();
                            if (!source) return null;
                            
                            source.buffer = noiseBuffer;
                            source.loop = true;
                            source.connect(gainNode);
                            return { source, gainNode };
                            
                        case 'rain':
                            // Simulación de lluvia con ruido filtrado
                            noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
                            if (!noiseBuffer) return null;
                            
                            const rainOutput = noiseBuffer.getChannelData(0);
                            for (let i = 0; i < rainOutput.length; i++) {
                                rainOutput[i] = (Math.random() * 2 - 1) * 0.3;
                            }
                            source = this.audioContext.createBufferSource();
                            if (!source) return null;
                            
                            source.buffer = noiseBuffer;
                            source.loop = true;
                            
                            const rainFilter = this.audioContext.createBiquadFilter();
                            if (!rainFilter) return null;
                            
                            rainFilter.type = 'lowpass';
                            rainFilter.frequency.value = 1000;
                            
                            source.connect(rainFilter);
                            rainFilter.connect(gainNode);
                            return { source, gainNode, filter: rainFilter };
                            
                        case 'ocean':
                            // Ondas del océano con oscilador de baja frecuencia
                            oscillator = this.audioContext.createOscillator();
                            if (!oscillator) return null;
                            
                            oscillator.type = 'sine';
                            oscillator.frequency.value = 0.1;
                            
                            const oceanGain = this.audioContext.createGain();
                            if (!oceanGain) return null;
                            
                            oceanGain.gain.value = 0.3;
                            
                            const oceanFilter = this.audioContext.createBiquadFilter();
                            if (!oceanFilter) return null;
                            
                            oceanFilter.type = 'lowpass';
                            oceanFilter.frequency.value = 500;
                            
                            // Ruido para simular las olas
                            noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
                            if (!noiseBuffer) return null;
                            
                            const oceanOutput = noiseBuffer.getChannelData(0);
                            for (let i = 0; i < oceanOutput.length; i++) {
                                oceanOutput[i] = (Math.random() * 2 - 1) * 0.2;
                            }
                            source = this.audioContext.createBufferSource();
                            if (!source) return null;
                            
                            source.buffer = noiseBuffer;
                            source.loop = true;
                            
                            source.connect(oceanFilter);
                            oceanFilter.connect(oceanGain);
                            oceanGain.connect(gainNode);
                            
                            oscillator.connect(gainNode);
                            return { source, oscillator, gainNode };
                            
                        case 'forest':
                            // Sonidos del bosque con múltiples frecuencias
                            const forestGain = this.audioContext.createGain();
                            if (!forestGain) return null;
                            
                            forestGain.gain.value = 0.2;
                            forestGain.connect(gainNode);
                            
                            noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
                            if (!noiseBuffer) return null;
                            
                            const forestOutput = noiseBuffer.getChannelData(0);
                            for (let i = 0; i < forestOutput.length; i++) {
                                forestOutput[i] = (Math.random() * 2 - 1) * 0.15;
                            }
                            source = this.audioContext.createBufferSource();
                            if (!source) return null;
                            
                            source.buffer = noiseBuffer;
                            source.loop = true;
                            
                            const forestFilter = this.audioContext.createBiquadFilter();
                            if (!forestFilter) return null;
                            
                            forestFilter.type = 'bandpass';
                            forestFilter.frequency.value = 800;
                            forestFilter.Q.value = 0.5;
                            
                            source.connect(forestFilter);
                            forestFilter.connect(forestGain);
                            return { source, gainNode: forestGain };
                            
                        case 'coffee':
                            // Ambiente de cafetería con ruido rosa
                            noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
                            if (!noiseBuffer) return null;
                            
                            const coffeeOutput = noiseBuffer.getChannelData(0);
                            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
                            for (let i = 0; i < coffeeOutput.length; i++) {
                                const white = Math.random() * 2 - 1;
                                b0 = 0.99886 * b0 + white * 0.0555179;
                                b1 = 0.99332 * b1 + white * 0.0750759;
                                b2 = 0.96900 * b2 + white * 0.1538520;
                                b3 = 0.86650 * b3 + white * 0.3104856;
                                b4 = 0.55000 * b4 + white * 0.5329522;
                                b5 = -0.7616 * b5 - white * 0.0168980;
                                coffeeOutput[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                                b6 = white * 0.115926;
                            }
                            source = this.audioContext.createBufferSource();
                            if (!source) return null;
                            
                            source.buffer = noiseBuffer;
                            source.loop = true;
                            source.connect(gainNode);
                            return { source, gainNode };
                            
                        case 'fire':
                            // Sonido de chimenea con ruido crackling
                            noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
                            if (!noiseBuffer) return null;
                            
                            const fireOutput = noiseBuffer.getChannelData(0);
                            for (let i = 0; i < fireOutput.length; i++) {
                                fireOutput[i] = (Math.random() * 2 - 1) * 0.25 * (Math.random() > 0.95 ? 3 : 1);
                            }
                            source = this.audioContext.createBufferSource();
                            if (!source) return null;
                            
                            source.buffer = noiseBuffer;
                            source.loop = true;
                            
                            const fireFilter = this.audioContext.createBiquadFilter();
                            if (!fireFilter) return null;
                            
                            fireFilter.type = 'lowpass';
                            fireFilter.frequency.value = 2000;
                            
                            source.connect(fireFilter);
                            fireFilter.connect(gainNode);
                            return { source, gainNode };
                            
                        case 'ambient-deep-work':
                            return this.createRealLoFiAudio(gainNode, 'https://dailyhub.life/wp-content/uploads/2025/08/Ambient-deep-work.mp3');
                            
                        case 'deep-work':
                            return this.createRealLoFiAudio(gainNode, 'https://dailyhub.life/wp-content/uploads/2025/08/Deep-Work.mp3');
                            
                        case 'lofi-beats-focus':
                            return this.createRealLoFiAudio(gainNode, 'https://dailyhub.life/wp-content/uploads/2025/08/Lofi-Beats-for-Deep-Focus-Study.mp3');
                            
                        case 'lofi-work-calm':
                            return this.createRealLoFiAudio(gainNode, 'https://dailyhub.life/wp-content/uploads/2025/08/Lofi-work-calm.mp3');
                            
                        case 'study-work-focus':
                            return this.createRealLoFiAudio(gainNode, 'https://dailyhub.life/wp-content/uploads/2025/08/Study-Work-Focus.mp3');
                    }
                    
                    return null;
                } catch (error) {
                    console.error('Error creating sound generator:', error);
                    return null;
                }
            }
            
            toggleSound(soundType) {
                // Inicializar audio context si no existe
                if (!this.audioContext) {
                    this.initAudioContext();
                }

                // Si aún no se puede crear, mostrar mensaje
                if (!this.audioContext) {
                    this.showToast('Audio no disponible - Intenta hacer clic primero 🔇');
                    return;
                }

                // Si ya está reproduciendo este sonido, lo detiene
                if (this.currentSound === soundType) {
                    this.stopSound();
                    return;
                }
                
                // Detener sonido actual si existe
                this.stopSound();
                
                // Iniciar nuevo sonido
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        this.startSound(soundType);
                    }).catch(e => {
                        console.error('Error al reanudar audio context:', e);
                        this.showToast('Haz clic en cualquier lugar primero para activar audio 🔇');
                    });
                } else {
                    this.startSound(soundType);
                }
            }

            startSound(soundType) {
                const soundNode = this.createSoundGenerator(soundType);
                if (soundNode) {
                    this.soundNodes = soundNode;
                    this.currentSound = soundType;
                    
                    try {
                        // Iniciar reproducción
                        if (soundNode.audioElement) {
                            // Para audio HTML5 real
                            soundNode.audioElement.play().catch(e => {
                                console.error('Error al reproducir audio HTML5:', e);
                                this.showToast('Error al reproducir música lo-fi 🎵');
                            });
                        } else {
                            // Para sonidos generados
                            if (soundNode.source) {
                                soundNode.source.start();
                            }
                            if (soundNode.oscillator) {
                                soundNode.oscillator.start();
                            }
                            if (soundNode.rainSource) {
                                soundNode.rainSource.start();
                            }
                        }
                        
                        // Actualizar UI
                        this.updateSoundButtons();
                        this.showToast(`Sonido activado: ${this.getSoundName(soundType)} 🎵`);
                    } catch (e) {
                        console.error('Error al iniciar sonido:', e);
                        this.showToast('Error al reproducir sonido 🔇');
                        this.stopSound();
                    }
                }
            }

            getSoundName(soundType) {
                const names = {
                    'rain': 'Lluvia',
                    'forest': 'Bosque',
                    'ocean': 'Océano',
                    'coffee': 'Cafetería',
                    'white': 'Ruido Blanco',
                    'fire': 'Chimenea',
                    'ambient-deep-work': 'Ambient Deep Work',
                    'deep-work': 'Deep Work',
                    'lofi-beats-focus': 'Lofi Beats for Deep Focus Study',
                    'lofi-work-calm': 'Lofi Work Calm',
                    'study-work-focus': 'Study Work Focus'
                };
                return names[soundType] || soundType;
            }
            
            stopSound() {
                try {
                    // Detener audio HTML5 si existe
                    if (this.soundNodes.audioElement) {
                        this.soundNodes.audioElement.pause();
                        this.soundNodes.audioElement.currentTime = 0;
                    }
                    
                    // Detener nodos de audio generados
                    if (this.soundNodes.source) {
                        this.soundNodes.source.stop();
                        this.soundNodes.source.disconnect();
                    }
                    if (this.soundNodes.oscillator) {
                        this.soundNodes.oscillator.stop();
                        this.soundNodes.oscillator.disconnect();
                    }
                    if (this.soundNodes.rainSource) {
                        this.soundNodes.rainSource.stop();
                        this.soundNodes.rainSource.disconnect();
                    }
                    if (this.soundNodes.gainNode) {
                        this.soundNodes.gainNode.disconnect();
                    }
                } catch (e) {
                    // Ignorar errores de nodos ya desconectados
                }
                
                this.soundNodes = {};
                const previousSound = this.currentSound;
                this.currentSound = null;
                this.updateSoundButtons();
                
                if (previousSound) {
                    this.showToast(`Sonido desactivado: ${this.getSoundName(previousSound)} 🔇`);
                }
            }
            
            updateVolume(value) {
                this.soundVolume = value / 100;
                document.getElementById('volumeDisplay').textContent = value + '%';
                
                // Actualizar volumen para audio HTML5
                if (this.soundNodes.audioElement) {
                    this.soundNodes.audioElement.volume = this.soundVolume;
                }
                
                // Actualizar volumen para nodos de audio generados
                if (this.soundNodes.gainNode) {
                    try {
                        this.soundNodes.gainNode.gain.setValueAtTime(this.soundVolume, this.audioContext.currentTime);
                    } catch (e) {
                        // Fallback si setValueAtTime falla
                        this.soundNodes.gainNode.gain.value = this.soundVolume;
                    }
                }
            }
            
            createRealLoFiAudio(gainNode, audioUrl) {
                try {
                    if (!this.audioContext || !gainNode || !audioUrl) {
                        return this.createLoFiBeats(gainNode, 'chill');
                    }
                    
                    // Crear elemento de audio HTML5
                    const audio = new Audio(audioUrl);
                    if (!audio) {
                        return this.createLoFiBeats(gainNode, 'chill');
                    }
                    
                    audio.loop = true; // Repetir automáticamente
                    audio.crossOrigin = 'anonymous';
                    audio.volume = this.soundVolume;
                    
                    // Crear source node desde el elemento de audio
                    const source = this.audioContext.createMediaElementSource(audio);
                    if (!source) {
                        return this.createLoFiBeats(gainNode, 'chill');
                    }
                    
                    // Conectar al gain node
                    source.connect(gainNode);
                    
                    // Manejar eventos de carga
                    audio.addEventListener('canplaythrough', () => {
                        console.log('Audio lo-fi cargado correctamente');
                    });
                    
                    audio.addEventListener('error', (e) => {
                        console.error('Error al cargar audio lo-fi:', e);
                        if (this.showToast) {
                            this.showToast('Error al cargar música lo-fi 🎵');
                        }
                    });
                    
                    return {
                        audioElement: audio,
                        source: source,
                        gainNode: gainNode
                    };
                } catch (error) {
                    console.error('Error al crear audio lo-fi:', error);
                    return this.createLoFiBeats(gainNode, 'chill'); // Fallback
                }
            }

            createLoFiBeats(gainNode, style) {
                // Crear un generador de beats lo-fi básico
                const masterGain = this.audioContext.createGain();
                masterGain.gain.value = 0.3;
                masterGain.connect(gainNode);
                
                // Oscilador principal para la melodía
                const mainOsc = this.audioContext.createOscillator();
                const mainGain = this.audioContext.createGain();
                
                // Configurar según el estilo
                switch(style) {
                    case 'chill':
                        mainOsc.type = 'sine';
                        mainOsc.frequency.value = 220;
                        mainGain.gain.value = 0.4;
                        break;
                    case 'jazz':
                        mainOsc.type = 'triangle';
                        mainOsc.frequency.value = 165;
                        mainGain.gain.value = 0.3;
                        break;
                    case 'piano':
                        mainOsc.type = 'square';
                        mainOsc.frequency.value = 261.63; // C4
                        mainGain.gain.value = 0.2;
                        break;
                    case 'study':
                        mainOsc.type = 'sine';
                        mainOsc.frequency.value = 196;
                        mainGain.gain.value = 0.35;
                        break;
                    case 'night':
                        mainOsc.type = 'triangle';
                        mainOsc.frequency.value = 146.83;
                        mainGain.gain.value = 0.25;
                        break;
                    case 'rain':
                        mainOsc.type = 'sine';
                        mainOsc.frequency.value = 220;
                        mainGain.gain.value = 0.3;
                        break;
                }
                
                // Filtro lo-fi
                const lofiFilter = this.audioContext.createBiquadFilter();
                lofiFilter.type = 'lowpass';
                lofiFilter.frequency.value = 3000;
                lofiFilter.Q.value = 0.5;
                
                // Conectar cadena de audio
                mainOsc.connect(mainGain);
                mainGain.connect(lofiFilter);
                lofiFilter.connect(masterGain);
                
                // Agregar ruido de vinilo para efecto lo-fi
                const vinylNoise = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
                const vinylOutput = vinylNoise.getChannelData(0);
                for (let i = 0; i < vinylOutput.length; i++) {
                    vinylOutput[i] = (Math.random() * 2 - 1) * 0.05;
                }
                
                const vinylSource = this.audioContext.createBufferSource();
                vinylSource.buffer = vinylNoise;
                vinylSource.loop = true;
                
                const vinylGain = this.audioContext.createGain();
                vinylGain.gain.value = 0.1;
                
                vinylSource.connect(vinylGain);
                vinylGain.connect(masterGain);
                
                // Si es el estilo 'rain', agregar sonido de lluvia
                if (style === 'rain') {
                    const rainBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
                    const rainOutput = rainBuffer.getChannelData(0);
                    for (let i = 0; i < rainOutput.length; i++) {
                        rainOutput[i] = (Math.random() * 2 - 1) * 0.15;
                    }
                    
                    const rainSource = this.audioContext.createBufferSource();
                    rainSource.buffer = rainBuffer;
                    rainSource.loop = true;
                    
                    const rainFilter = this.audioContext.createBiquadFilter();
                    rainFilter.type = 'lowpass';
                    rainFilter.frequency.value = 1000;
                    
                    const rainGain = this.audioContext.createGain();
                    rainGain.gain.value = 0.2;
                    
                    rainSource.connect(rainFilter);
                    rainFilter.connect(rainGain);
                    rainGain.connect(masterGain);
                    
                    return { 
                        oscillator: mainOsc, 
                        source: vinylSource, 
                        rainSource: rainSource,
                        gainNode: masterGain 
                    };
                }
                
                return { 
                    oscillator: mainOsc, 
                    source: vinylSource, 
                    gainNode: masterGain 
                };
            }

            updateSoundButtons() {
                document.querySelectorAll('.sound-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.sound === this.currentSound);
                });
            }
            
            switchSoundTab(tabName) {
                // Actualizar tabs
                document.querySelectorAll('.sound-tab').forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.tab === tabName);
                });
                
                // Actualizar contenido
                document.querySelectorAll('.sound-tab-content').forEach(content => {
                    content.classList.toggle('active', content.id === `${tabName}-tab`);
                });
                
                // Detener sonido actual al cambiar de tab
                if (this.currentSound) {
                    this.stopSound();
                }
            }
            
            // Métodos de persistencia
            initPersistence() {
                // Cargar configuración de persistencia
                const savedDuration = localStorage.getItem('persistenceDuration');
                if (savedDuration) {
                    this.persistenceDuration = parseInt(savedDuration);
                    document.getElementById('persistenceDuration').value = savedDuration;
                }
                
                // Cargar datos guardados
                this.loadData();
                
                // Configurar guardado automático cada 30 segundos
                this.autoSaveInterval = setInterval(() => {
                    this.saveData();
                }, 30000);
                
                // Guardar antes de cerrar la ventana y limpiar recursos
                window.addEventListener('beforeunload', () => {
                    this.saveData();
                    this.stopSound();
                    
                    // Limpiar respiración
                    if (this.breathingActive) {
                        this.stopBreathing();
                    }
                    this.stopBreathingAmbientSound();
                    
                    // Limpiar timers
                    if (this.autoSaveInterval) {
                        clearInterval(this.autoSaveInterval);
                    }
                    if (this.toastTimeout) {
                        clearTimeout(this.toastTimeout);
                    }
                    if (this.breathingTimer) {
                        clearInterval(this.breathingTimer);
                    }
                    if (this.meetingTimer) {
                        clearInterval(this.meetingTimer);
                    }
                    
                    // Desconectar audio context
                    if (this.audioContext && this.audioContext.state !== 'closed') {
                        this.audioContext.close();
                    }
                });
                
                // Limpiar datos expirados al iniciar
                this.cleanExpiredData();
                
                this.updateDataStatus();
            }
            
            saveData() {
                if (!this.tasks || !Array.isArray(this.tasks)) {
                    console.error('Tasks data is invalid');
                    return;
                }
                
                const dataToSave = {
                    tasks: this.tasks,
                    pomodoroCount: Math.max(0, this.pomodoroCount || 0),
                    tasksCompleted: Math.max(0, this.tasksCompleted || 0),
                    taskIdCounter: Math.max(0, this.taskIdCounter || 0),
                    timestamp: Date.now(),
                    persistenceDuration: this.persistenceDuration || 24
                };
                
                try {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('pomoAdoroData', JSON.stringify(dataToSave));
                        if (this.updateDataStatus) {
                            this.updateDataStatus('Datos guardados automáticamente ✅');
                        }
                    }
                } catch (error) {
                    console.error('Error al guardar datos:', error);
                    if (this.updateDataStatus) {
                        this.updateDataStatus('Error al guardar datos ❌');
                    }
                }
            }
            
            loadData() {
                try {
                    if (typeof localStorage === 'undefined') {
                        if (this.updateDataStatus) {
                            this.updateDataStatus('LocalStorage no disponible 🚫');
                        }
                        return;
                    }
                    
                    const savedData = localStorage.getItem('pomoAdoroData');
                    if (savedData) {
                        const data = JSON.parse(savedData);
                        const now = Date.now();
                        const expirationTime = data.timestamp + ((data.persistenceDuration || 24) * 60 * 60 * 1000);
                        
                        // Verificar si los datos no han expirado
                        if (now < expirationTime) {
                            this.tasks = Array.isArray(data.tasks) ? data.tasks : [];
                            // Asegurar que todas las tareas tengan prioridad y limpiar timeEstimate
                            this.tasks.forEach((task, index) => {
                                if (task.priority === undefined) {
                                    task.priority = index + 1;
                                }
                                if (task.priorityLevel === undefined) {
                                    task.priorityLevel = 'none';
                                }
                                // Eliminar timeEstimate si existe (migración)
                                delete task.timeEstimate;
                            });
                            this.pomodoroCount = Math.max(0, data.pomodoroCount || 0);
                            this.tasksCompleted = Math.max(0, data.tasksCompleted || 0);
                            this.taskIdCounter = Math.max(0, data.taskIdCounter || 0);
                            
                            // Actualizar UI con verificaciones de seguridad
                            if (this.renderTasks) this.renderTasks();
                            if (this.updateTasksStats) this.updateTasksStats();
                            
                            const pomodoroCountEl = document.getElementById('pomodoroCount');
                            if (pomodoroCountEl) {
                                pomodoroCountEl.textContent = this.pomodoroCount;
                            }
                            
                            const plantsDisplay = document.getElementById('plantsDisplay');
                            if (plantsDisplay) {
                                plantsDisplay.textContent = '🌱'.repeat(this.pomodoroCount);
                            }
                            
                            const timeLeft = Math.ceil((expirationTime - now) / (1000 * 60 * 60));
                            if (this.updateDataStatus) {
                                this.updateDataStatus(`Datos cargados (expiran en ${timeLeft}h) 📂`);
                            }
                            
                            if (this.tasks.length > 0 && this.showToast) {
                                this.showToast(`¡Bienvenido de vuelta! Se cargaron ${this.tasks.length} tareas 📋`);
                            }
                        } else {
                            // Datos expirados, limpiar
                            if (this.clearAllData) this.clearAllData(false);
                            if (this.updateDataStatus) {
                                this.updateDataStatus('Datos anteriores expirados y limpiados 🗑️');
                            }
                        }
                    } else {
                        if (this.updateDataStatus) {
                            this.updateDataStatus('Sin datos guardados - Comenzando nuevo 🆕');
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar datos:', error);
                    if (this.updateDataStatus) {
                        this.updateDataStatus('Error al cargar datos ❌');
                    }
                }
            }
            
            updatePersistenceDuration(hours) {
                this.persistenceDuration = parseInt(hours);
                localStorage.setItem('persistenceDuration', hours);
                this.saveData(); // Guardar con nueva duración
                
                const labels = {
                    '24': '24 horas',
                    '48': '48 horas', 
                    '168': '1 semana',
                    '720': '1 mes'
                };
                
                this.updateDataStatus(`Configuración actualizada: ${labels[hours]} 🔧`);
                this.showToast(`Datos se guardarán por ${labels[hours]} 💾`);
            }
            
            clearAllData(showConfirmation = true) {
                if (showConfirmation) {
                    const userConfirmed = confirm('¿Estás seguro de que quieres eliminar todas las tareas? Esta acción no se puede deshacer.');
                    if (!userConfirmed) {
                        return;
                    }
                }
                
                // Solo limpiar tareas, mantener todo lo demás
                this.tasks = [];
                this.taskIdCounter = 0;
                
                // Actualizar UI solo para tareas
                this.renderTasks();
                this.updateTasksStats();
                
                // Guardar datos actualizados (sin las tareas)
                this.saveData();
                
                this.updateDataStatus('Tareas eliminadas, progreso mantenido ✅');
                
                if (showConfirmation) {
                    this.showToast('¡Tareas eliminadas! Tu progreso y configuración se mantienen 📝');
                }
            }
            
            cleanExpiredData() {
                try {
                    const savedData = localStorage.getItem('pomoAdoroData');
                    if (savedData) {
                        const data = JSON.parse(savedData);
                        const now = Date.now();
                        const expirationTime = data.timestamp + (data.persistenceDuration * 60 * 60 * 1000);
                        
                        if (now >= expirationTime) {
                            this.clearAllData(false);
                        }
                    }
                } catch (error) {
                    console.error('Error al limpiar datos expirados:', error);
                }
            }
            
            updateDataStatus(message = 'Inicializando sistema de guardado...') {
                const statusElement = document.getElementById('dataStatus');
                if (statusElement) {
                    statusElement.innerHTML = `<span class="status-text">${message}</span>`;
                }
            }
            
            // Métodos para drag and drop
            handleDragStart(e) {
                this.draggedTaskId = parseInt(e.target.dataset.taskId);
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.outerHTML);
            }
            
            handleDragOver(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }
            
            handleDragEnter(e) {
                e.preventDefault();
                if (e.target.classList.contains('task-item') && 
                    parseInt(e.target.dataset.taskId) !== this.draggedTaskId) {
                    e.target.classList.add('drag-over');
                }
            }
            
            handleDragLeave(e) {
                if (e.target.classList.contains('task-item')) {
                    e.target.classList.remove('drag-over');
                }
            }
            
            handleDrop(e) {
                e.preventDefault();
                const targetTaskId = parseInt(e.target.closest('.task-item').dataset.taskId);
                
                if (targetTaskId !== this.draggedTaskId) {
                    this.reorderTasks(this.draggedTaskId, targetTaskId);
                }
                
                // Limpiar clases de drag
                document.querySelectorAll('.task-item').forEach(item => {
                    item.classList.remove('drag-over', 'dragging');
                });
            }
            
            handleDragEnd(e) {
                e.target.classList.remove('dragging');
                document.querySelectorAll('.task-item').forEach(item => {
                    item.classList.remove('drag-over');
                });
                this.draggedTaskId = null;
            }
            
            moveTaskToEnd(taskId) {
                const task = this.tasks.find(t => t.id === taskId);
                if (!task) return;
                
                // Obtener la prioridad más alta entre las tareas completadas
                const completedTasks = this.tasks.filter(t => t.completed && t.id !== taskId);
                const maxCompletedPriority = completedTasks.length > 0 
                    ? Math.max(...completedTasks.map(t => t.priority || 0))
                    : Math.max(...this.tasks.map(t => t.priority || 0));
                
                // Asignar la prioridad más alta + 1 a la tarea recién completada
                task.priority = maxCompletedPriority + 1;
            }
            
            reorderTasks(draggedId, targetId) {
                const draggedTask = this.tasks.find(t => t.id === draggedId);
                const targetTask = this.tasks.find(t => t.id === targetId);
                
                if (!draggedTask || !targetTask) return;
                
                // Obtener las posiciones actuales ordenadas
                const sortedTasks = [...this.tasks].sort((a, b) => (a.priority || 0) - (b.priority || 0));
                const draggedIndex = sortedTasks.findIndex(t => t.id === draggedId);
                const targetIndex = sortedTasks.findIndex(t => t.id === targetId);
                
                // Remover la tarea arrastrada
                sortedTasks.splice(draggedIndex, 1);
                
                // Insertar en la nueva posición
                const newTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
                sortedTasks.splice(newTargetIndex, 0, draggedTask);
                
                // Actualizar prioridades
                sortedTasks.forEach((task, index) => {
                    task.priority = index + 1;
                });
                
                this.renderTasks();
                this.saveData(); // Guardar automáticamente
                this.showToast('¡Prioridad actualizada! 🔄');
            }
            

            
            // Método para alternar explicación
            toggleExplanation() {
                const explanation = document.getElementById('persistenceExplanation');
                const arrow = document.querySelector('.toggle-arrow');
                
                if (explanation.style.display === 'none') {
                    explanation.style.display = 'block';
                    arrow.classList.add('rotated');
                } else {
                    explanation.style.display = 'none';
                    arrow.classList.remove('rotated');
                }
            }

            // Método para inicializar sección de sonidos
            initSoundsSection() {
                const soundsContent = document.getElementById('soundsContent');
                soundsContent.classList.add('collapsed');
                
                const arrow = document.querySelector('#soundsToggle .toggle-arrow');
                if (arrow) {
                    arrow.classList.add('rotated');
                    arrow.textContent = '▲';
                }
            }

            // Método para alternar sección de sonidos
            toggleSoundsSection() {
                const soundsContent = document.getElementById('soundsContent');
                const arrow = document.querySelector('#soundsToggle .toggle-arrow');
                
                if (soundsContent.classList.contains('collapsed')) {
                    soundsContent.classList.remove('collapsed');
                    arrow.classList.remove('rotated');
                    arrow.textContent = '▼';
                } else {
                    soundsContent.classList.add('collapsed');
                    arrow.classList.add('rotated');
                    arrow.textContent = '▲';
                }
            }



            selectBreathingTechnique(technique) {
                this.currentBreathingTechnique = technique;
                
                // Actualizar UI
                document.querySelectorAll('.technique-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.technique === technique);
                });
                
                // Mostrar timer
                document.getElementById('breathingTimer').style.display = 'block';
                
                // Actualizar información
                const techniqueData = this.breathingTechniques[technique];
                document.getElementById('breathingProgress').textContent = 
                    `Técnica seleccionada: ${techniqueData.name} - ${techniqueData.benefits}`;
                
                this.showToast(`Técnica ${techniqueData.name} seleccionada 🧘‍♀️`);
            }

            startBreathing() {
                if (!this.currentBreathingTechnique) {
                    this.showToast('Selecciona una técnica primero 🧘‍♀️');
                    return;
                }
                
                this.breathingActive = true;
                this.breathingCycleCount = 0;
                this.breathingDuration = parseInt(document.getElementById('breathingDuration').value);
                
                const technique = this.breathingTechniques[this.currentBreathingTechnique];
                const totalCycles = Math.floor((this.breathingDuration * 60) / technique.cycleTime);
                
                document.getElementById('startBreathingBtn').style.display = 'none';
                document.getElementById('stopBreathingBtn').style.display = 'inline-block';
                
                this.currentPhaseIndex = 0;
                this.phaseTimeLeft = technique.phases[0].duration;
                this.breathingPhase = technique.phases[0].name;
                
                // Iniciar sonido ambiental de fondo
                this.startBreathingAmbientSound();
                
                // Reproducir sonido inicial
                this.playBreathingPhaseSound(technique.phases[0].name);
                
                this.updateBreathingDisplay();
                this.breathingTimer = setInterval(() => this.breathingTick(), 1000);
                
                this.showToast(`¡Respiración iniciada por ${this.breathingDuration} minutos! 🌬️`);
            }

            breathingTick() {
                if (!this.breathingActive) return;
                
                const technique = this.breathingTechniques[this.currentBreathingTechnique];
                const currentPhase = technique.phases[this.currentPhaseIndex];
                
                this.phaseTimeLeft--;
                
                if (this.phaseTimeLeft <= 0) {
                    // Pasar a la siguiente fase
                    this.currentPhaseIndex++;
                    
                    if (this.currentPhaseIndex >= technique.phases.length) {
                        // Completar ciclo
                        this.currentPhaseIndex = 0;
                        this.breathingCycleCount++;
                        
                        // Verificar si se completó la duración
                        const totalCycles = Math.floor((this.breathingDuration * 60) / technique.cycleTime);
                        if (this.breathingCycleCount >= totalCycles) {
                            this.completeBreathing();
                            return;
                        }
                    }
                    
                    const nextPhase = technique.phases[this.currentPhaseIndex];
                    this.phaseTimeLeft = nextPhase.duration;
                    this.breathingPhase = nextPhase.name;
                    
                    // Reproducir sonido de transición de fase
                    this.playBreathingPhaseSound(nextPhase.name);
                }
                
                this.updateBreathingDisplay();
            }

            updateBreathingDisplay() {
                const technique = this.breathingTechniques[this.currentBreathingTechnique];
                const currentPhase = technique.phases[this.currentPhaseIndex];
                
                // Actualizar círculo
                const circle = document.getElementById('breathingCircle');
                const instruction = document.getElementById('breathingInstruction');
                
                circle.className = `breathing-circle ${this.breathingPhase}`;
                instruction.textContent = `${currentPhase.instruction} (${this.phaseTimeLeft})`;
                
                // Actualizar progreso
                const totalCycles = Math.floor((this.breathingDuration * 60) / technique.cycleTime);
                const progress = document.getElementById('breathingProgress');
                progress.textContent = `Ciclo ${this.breathingCycleCount + 1} de ${totalCycles} - ${technique.name}`;
            }

            startBreathingAmbientSound() {
                // Detener sonido ambiental anterior si existe
                this.stopBreathingAmbientSound();
                
                // Crear nuevo sonido ambiental
                this.breathingAmbientSound = this.createBreathingAmbientSound();
                if (this.breathingAmbientSound && this.breathingAmbientSound.source) {
                    try {
                        this.breathingAmbientSound.source.start();
                    } catch (error) {
                        console.log('Error al iniciar sonido ambiental de respiración:', error);
                    }
                }
            }

            stopBreathingAmbientSound() {
                if (this.breathingAmbientSound) {
                    try {
                        if (this.breathingAmbientSound.source) {
                            this.breathingAmbientSound.source.stop();
                            this.breathingAmbientSound.source.disconnect();
                        }
                        if (this.breathingAmbientSound.gainNode) {
                            this.breathingAmbientSound.gainNode.disconnect();
                        }
                    } catch (error) {
                        // Ignorar errores de nodos ya desconectados
                    }
                    this.breathingAmbientSound = null;
                }
            }

            stopBreathing() {
                this.breathingActive = false;
                if (this.breathingTimer) {
                    clearInterval(this.breathingTimer);
                    this.breathingTimer = null;
                }
                
                // Detener sonido ambiental
                this.stopBreathingAmbientSound();
                
                document.getElementById('startBreathingBtn').style.display = 'inline-block';
                document.getElementById('stopBreathingBtn').style.display = 'none';
                
                // Resetear círculo
                const circle = document.getElementById('breathingCircle');
                const instruction = document.getElementById('breathingInstruction');
                
                circle.className = 'breathing-circle';
                instruction.textContent = 'Respiración detenida';
                
                document.getElementById('breathingProgress').textContent = 'Respiración detenida';
                
                this.showToast('Respiración detenida 🛑');
            }

            completeBreathing() {
                this.breathingActive = false;
                if (this.breathingTimer) {
                    clearInterval(this.breathingTimer);
                    this.breathingTimer = null;
                }
                
                // Detener sonido ambiental
                this.stopBreathingAmbientSound();
                
                const technique = this.breathingTechniques[this.currentBreathingTechnique];
                
                // Reproducir sonido de completado
                this.playBreathingCompletionSound();
                
                document.getElementById('startBreathingBtn').style.display = 'inline-block';
                document.getElementById('stopBreathingBtn').style.display = 'none';
                
                // Mostrar mensaje de completado
                const instruction = document.getElementById('breathingInstruction');
                instruction.textContent = '¡Completado! 🌟';
                
                document.getElementById('breathingProgress').textContent = 
                    `¡Sesión de ${technique.name} completada! Excelente trabajo 🧘‍♀️`;
                
                this.showToast(`¡Sesión de respiración completada! Te sientes más centrado/a 🌟`);
                
                // Efecto de confetti
                this.showConfetti();
                
                // Cerrar modal después de un momento
                setTimeout(() => {
                    this.closeBreathingModal();
                }, 3000);
            }
            
            resetPomodoros() {
                const userConfirmed = confirm('¿Estás seguro de que quieres reiniciar el contador de Pomodoros completados?');
                if (userConfirmed) {
                    this.pomodoroCount = Math.max(0, 0); // Asegurar que nunca sea negativo
                    document.getElementById('pomodoroCount').textContent = '0';
                    
                    // Limpiar plantitas
                    const plantsDisplay = document.getElementById('plantsDisplay');
                    plantsDisplay.textContent = '';
                    
                    this.showToast('¡Contador de Pomodoros reiniciado! 🔄');
                }
            }

            resetTasksCompleted() {
                const userConfirmed = confirm('¿Estás seguro de que quieres reiniciar el contador de tareas completadas?');
                if (userConfirmed) {
                    this.tasksCompleted = Math.max(0, 0); // Asegurar que nunca sea negativo
                    document.getElementById('tasksCompletedCount').textContent = '0';
                    this.showToast('¡Contador de tareas completadas reiniciado! 🔄');
                }
            }

            // Métodos de tema
            initTheme() {
                // Cargar tema guardado
                const savedTheme = localStorage.getItem('pomoAdoroTheme');
                if (savedTheme === 'dark') {
                    this.isDarkMode = true;
                    this.applyDarkMode();
                } else {
                    this.isDarkMode = false;
                    this.applyLightMode();
                }
            }

            toggleTheme() {
                this.isDarkMode = !this.isDarkMode;
                
                if (this.isDarkMode) {
                    this.applyDarkMode();
                    localStorage.setItem('pomoAdoroTheme', 'dark');
                    this.showToast('¡Modo oscuro activado! 🌙');
                } else {
                    this.applyLightMode();
                    localStorage.setItem('pomoAdoroTheme', 'light');
                    this.showToast('¡Modo claro activado! ☀️');
                }
            }

            applyDarkMode() {
                document.body.classList.add('dark-mode');
                const themeToggle = document.getElementById('themeToggle');
                const themeSlider = document.getElementById('themeSlider');
                
                themeToggle.classList.add('dark');
                themeSlider.textContent = '🌙';
            }

            applyLightMode() {
                document.body.classList.remove('dark-mode');
                const themeToggle = document.getElementById('themeToggle');
                const themeSlider = document.getElementById('themeSlider');
                
                themeToggle.classList.remove('dark');
                themeSlider.textContent = '☀️';
            }



            // WFH Features Methods
            initWFHFeatures() {
                this.loadWFHData();
            }





            // Meeting Mode Methods
            toggleMeetingMode() {
                const modal = document.getElementById('meetingModal');
                modal.classList.add('show');
                this.resetMeetingForm();
            }

            resetMeetingForm() {
                this.meetingMode = {
                    active: false,
                    startTime: null,
                    duration: 30,
                    parkingLot: []
                };
                
                const meetingTime = document.getElementById('meetingTime');
                const startMeetingBtn = document.getElementById('startMeetingBtn');
                const pauseMeetingBtn = document.getElementById('pauseMeetingBtn');
                const parkingInput = document.getElementById('parkingInput');
                const parkingList = document.getElementById('parkingList');
                const convertToTasksBtn = document.getElementById('convertToTasksBtn');
                
                if (meetingTime) meetingTime.textContent = '30:00';
                if (startMeetingBtn) startMeetingBtn.style.display = 'inline-block';
                if (pauseMeetingBtn) pauseMeetingBtn.style.display = 'none';
                if (parkingInput) parkingInput.value = '';
                if (parkingList) parkingList.innerHTML = '';
                if (convertToTasksBtn) convertToTasksBtn.disabled = true;
            }

            updateMeetingDuration(minutes) {
                this.meetingMode.duration = parseInt(minutes);
                const timeString = `${minutes}:00`;
                const meetingTime = document.getElementById('meetingTime');
                if (meetingTime) {
                    meetingTime.textContent = timeString;
                }
            }

            startMeeting() {
                this.meetingMode.active = true;
                this.meetingMode.startTime = Date.now();
                this.meetingMode.timeLeft = this.meetingMode.duration * 60;
                
                const startMeetingBtn = document.getElementById('startMeetingBtn');
                const pauseMeetingBtn = document.getElementById('pauseMeetingBtn');
                
                if (startMeetingBtn) startMeetingBtn.style.display = 'none';
                if (pauseMeetingBtn) pauseMeetingBtn.style.display = 'inline-block';
                
                this.meetingTimer = setInterval(() => this.updateMeetingTimer(), 1000);
                
                this.showToast(`¡Reunión iniciada por ${this.meetingMode.duration} minutos! 👥`);
                this.triggerEvent('meeting_started', { duration: this.meetingMode.duration });
            }

            pauseMeeting() {
                this.meetingMode.active = false;
                clearInterval(this.meetingTimer);
                
                document.getElementById('startMeetingBtn').style.display = 'inline-block';
                document.getElementById('pauseMeetingBtn').style.display = 'none';
                
                this.showToast('Reunión pausada ⏸️');
            }

            updateMeetingTimer() {
                if (!this.meetingMode.active) return;
                
                this.meetingMode.timeLeft--;
                
                const minutes = Math.floor(this.meetingMode.timeLeft / 60);
                const seconds = this.meetingMode.timeLeft % 60;
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                const meetingTime = document.getElementById('meetingTime');
                if (meetingTime) {
                    meetingTime.textContent = timeString;
                }
                
                if (this.meetingMode.timeLeft <= 0) {
                    this.endMeeting();
                    this.showToast('¡Tiempo de reunión terminado! 🔔');
                }
            }

            endMeeting() {
                this.meetingMode.active = false;
                if (this.meetingTimer) {
                    clearInterval(this.meetingTimer);
                }
                
                document.getElementById('meetingModal').classList.remove('show');
                
                if (this.meetingMode.parkingLot.length > 0) {
                    this.showToast(`Reunión terminada. ${this.meetingMode.parkingLot.length} notas capturadas 📝`);
                } else {
                    this.showToast('Reunión terminada 👥');
                }
            }

            addParkingNote() {
                const input = document.getElementById('parkingInput');
                const noteText = input.value.trim();
                
                if (noteText) {
                    const note = {
                        id: Date.now(),
                        text: noteText,
                        timestamp: new Date().toLocaleTimeString()
                    };
                    
                    this.meetingMode.parkingLot.push(note);
                    this.renderParkingNotes();
                    input.value = '';
                    
                    // Enable convert button
                    document.getElementById('convertToTasksBtn').disabled = false;
                    
                    this.triggerEvent('parking_added', { note_length: noteText.length });
                }
            }

            renderParkingNotes() {
                const parkingList = document.getElementById('parkingList');
                parkingList.innerHTML = '';
                
                this.meetingMode.parkingLot.forEach(note => {
                    const noteElement = document.createElement('div');
                    noteElement.className = 'parking-item';
                    noteElement.innerHTML = `
                        <div class="parking-text">${note.text}</div>
                        <div class="parking-actions">
                            <button class="parking-action-btn delete" onclick="app.deleteParkingNote(${note.id})">
                                Eliminar
                            </button>
                        </div>
                    `;
                    parkingList.appendChild(noteElement);
                });
            }

            deleteParkingNote(noteId) {
                this.meetingMode.parkingLot = this.meetingMode.parkingLot.filter(note => note.id !== noteId);
                this.renderParkingNotes();
                
                if (this.meetingMode.parkingLot.length === 0) {
                    document.getElementById('convertToTasksBtn').disabled = true;
                }
            }

            convertParkingToTasks() {
                const tasksCreated = this.meetingMode.parkingLot.length;
                
                this.meetingMode.parkingLot.forEach(note => {
                    const task = {
                        id: this.taskIdCounter++,
                        text: `📝 ${note.text}`,
                        completed: false,
                        priority: this.tasks.length + 1
                    };
                    this.tasks.push(task);
                });
                
                this.renderTasks();
                
                // Close meeting modal
                document.getElementById('meetingModal').classList.remove('show');
                
                // Show success message with CTA
                this.showToast(`¡${tasksCreated} tareas creadas desde la reunión! 📝`);
                
                // Show transition modal with Pomodoro CTA
                setTimeout(() => {
                    const modal = document.getElementById('transitionModal');
                    const title = document.getElementById('transitionTitle');
                    const message = document.getElementById('transitionMessage');
                    const buttonsContainer = document.getElementById('transitionButtons');
                    
                    title.textContent = '📝 Tareas Creadas';
                    message.textContent = '¿Quieres empezar un Pomodoro para trabajar en estas tareas?';
                    buttonsContainer.innerHTML = `
                        <button class="transition-btn" onclick="app.startNewPomodoro(); app.closeTransitionModal();">¡Sí, empezar Pomodoro!</button>
                        <button class="transition-btn secondary" onclick="app.closeTransitionModal()">Más tarde</button>
                    `;
                    
                    modal.classList.add('show');
                }, 1000);
                
                this.triggerEvent('parking_to_task', { tasks_created: tasksCreated });
                this.triggerEvent('meeting_focus_return');
            }



            playBreathingPhaseSound(phase) {
                if (!this.audioContext) return;
                
                try {
                    // Crear un sonido suave y relajante para cada fase
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    const filter = this.audioContext.createBiquadFilter();
                    
                    // Configurar filtro para sonido más suave
                    filter.type = 'lowpass';
                    filter.frequency.value = 800;
                    filter.Q.value = 1;
                    
                    // Conectar nodos
                    oscillator.connect(filter);
                    filter.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    // Configurar sonido según la fase
                    switch(phase) {
                        case 'inhale':
                            // Sonido ascendente suave para inhalar
                            oscillator.type = 'sine';
                            oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
                            oscillator.frequency.exponentialRampToValueAtTime(330, this.audioContext.currentTime + 0.8);
                            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                            gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.1);
                            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
                            break;
                            
                        case 'hold':
                            // Sonido constante y tranquilo para mantener
                            oscillator.type = 'triangle';
                            oscillator.frequency.setValueAtTime(275, this.audioContext.currentTime);
                            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
                            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime + 0.4);
                            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
                            break;
                            
                        case 'exhale':
                            // Sonido descendente relajante para exhalar
                            oscillator.type = 'sine';
                            oscillator.frequency.setValueAtTime(330, this.audioContext.currentTime);
                            oscillator.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 1.2);
                            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                            gainNode.gain.linearRampToValueAtTime(0.12, this.audioContext.currentTime + 0.1);
                            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.2);
                            break;
                            
                        default:
                            // Sonido neutro para preparación
                            oscillator.type = 'sine';
                            oscillator.frequency.setValueAtTime(261.63, this.audioContext.currentTime); // C4
                            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                            gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.1);
                            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                            break;
                    }
                    
                    // Iniciar y detener el sonido
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 1.5);
                    
                } catch (error) {
                    console.log('Error al reproducir sonido de respiración:', error);
                }
            }

            createBreathingAmbientSound() {
                if (!this.audioContext) return null;
                
                try {
                    // Crear sonido ambiental suave de fondo durante la respiración
                    const gainNode = this.audioContext.createGain();
                    if (!gainNode) return null;
                    
                    gainNode.connect(this.audioContext.destination);
                    gainNode.gain.value = 0.05; // Muy suave
                    
                    // Generar ruido rosa suave
                    const bufferSize = this.audioContext.sampleRate * 2;
                    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
                    if (!noiseBuffer) return null;
                    
                    const output = noiseBuffer.getChannelData(0);
                    
                    // Algoritmo para ruido rosa (más natural que el blanco)
                    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
                    for (let i = 0; i < bufferSize; i++) {
                        const white = Math.random() * 2 - 1;
                        b0 = 0.99886 * b0 + white * 0.0555179;
                        b1 = 0.99332 * b1 + white * 0.0750759;
                        b2 = 0.96900 * b2 + white * 0.1538520;
                        b3 = 0.86650 * b3 + white * 0.3104856;
                        b4 = 0.55000 * b4 + white * 0.5329522;
                        b5 = -0.7616 * b5 - white * 0.0168980;
                        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11 * 0.3;
                        b6 = white * 0.115926;
                    }
                    
                    const source = this.audioContext.createBufferSource();
                    if (!source) return null;
                    
                    source.buffer = noiseBuffer;
                    source.loop = true;
                    
                    // Filtro pasa-bajos para hacer el sonido más suave
                    const filter = this.audioContext.createBiquadFilter();
                    if (!filter) return null;
                    
                    filter.type = 'lowpass';
                    filter.frequency.value = 400;
                    filter.Q.value = 0.5;
                    
                    source.connect(filter);
                    filter.connect(gainNode);
                    
                    return { source, gainNode };
                } catch (error) {
                    console.log('Error al crear sonido ambiental de respiración:', error);
                    return null;
                }
            }

            playBreathingCompletionSound() {
                if (!this.audioContext) return;
                
                try {
                    // Crear una secuencia de campanitas suaves para celebrar
                    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (acorde mayor)
                    
                    frequencies.forEach((freq, index) => {
                        setTimeout(() => {
                            const oscillator = this.audioContext.createOscillator();
                            const gainNode = this.audioContext.createGain();
                            const filter = this.audioContext.createBiquadFilter();
                            
                            // Configurar filtro para sonido cristalino
                            filter.type = 'lowpass';
                            filter.frequency.value = 2000;
                            filter.Q.value = 1;
                            
                            // Conectar nodos
                            oscillator.connect(filter);
                            filter.connect(gainNode);
                            gainNode.connect(this.audioContext.destination);
                            
                            // Configurar sonido de campanita
                            oscillator.type = 'sine';
                            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                            
                            // Envelope suave y celebratorio
                            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                            gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
                            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5);
                            
                            // Iniciar y detener
                            oscillator.start(this.audioContext.currentTime);
                            oscillator.stop(this.audioContext.currentTime + 1.5);
                            
                        }, index * 200); // Espaciar las notas
                    });
                    
                } catch (error) {
                    console.log('Error al reproducir sonido de completado:', error);
                }
            }

            showConfetti() {
                // Simple confetti effect using emojis
                const confettiEmojis = ['🎉', '✨', '🌟', '💫', '🎊'];
                const container = document.body;
                
                for (let i = 0; i < 20; i++) {
                    const confetti = document.createElement('div');
                    confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
                    confetti.style.position = 'fixed';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.top = '-10px';
                    confetti.style.fontSize = '2rem';
                    confetti.style.zIndex = '9999';
                    confetti.style.pointerEvents = 'none';
                    confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear forwards`;
                    
                    container.appendChild(confetti);
                    
                    setTimeout(() => {
                        if (confetti.parentNode) {
                            confetti.parentNode.removeChild(confetti);
                        }
                    }, 4000);
                }
            }

            loadWFHData() {
                // WFH data loading simplified - only meeting mode persisted
                // Other features removed for cleaner experience
            }

            triggerEvent(eventName, data = {}) {
                // Simple analytics event system
                console.log(`[Analytics] ${eventName}:`, data);
                
                // Store in localStorage for potential future analytics
                const events = JSON.parse(localStorage.getItem('pa.analytics') || '[]');
                events.push({
                    event: eventName,
                    data: data,
                    timestamp: Date.now()
                });
                
                // Keep only last 100 events
                if (events.length > 100) {
                    events.splice(0, events.length - 100);
                }
                
                localStorage.setItem('pa.analytics', JSON.stringify(events));
            }

            openFeedback() {
                window.open('https://forms.gle/RdKXQ5qVTsJYvs6B8', '_blank');
                this.showToast('¡Gracias por tu feedback! 💬');
                this.triggerEvent('feedback_opened');
            }



            // Método para exportar datos (bonus)
            exportData() {
                const dataToExport = {
                    tasks: this.tasks,
                    pomodoroCount: this.pomodoroCount,
                    tasksCompleted: this.tasksCompleted,
                    exportDate: new Date().toISOString(),
                    version: '1.0'
                };
                
                const dataStr = JSON.stringify(dataToExport, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                
                // Crear enlace temporal para descarga
                const link = document.createElement('a');
                link.href = url;
                link.download = `pomo-adoro-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                this.showToast('¡Datos exportados exitosamente! 📤');
            }
        }
        
        // Inicializar la aplicación
        const app = new PomoAdoro();

