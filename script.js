/*  TP : "Mini To-Do" persistant avec localStorage
    Étapes 1-6 + Bonus (compteur, édition, clavier) */

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearBtn = document.getElementById('clearBtn');
const taskCount = document.getElementById('taskCount');

let tasks = [];

// Charge les tâches depuis localStorage au chargement de la page
// Avec try/catch pour éviter les crashs si localStorage est corrompu
function loadTasks() {
  try {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      tasks = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des tâches:', error);
    tasks = [];
    localStorage.removeItem('tasks');
  }
  render();
}

// Sauvegarde les tâches dans localStorage
function saveTasks() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
}

// Met à jour le compteur de tâches restantes (Bonus)
function updateCounter() {
  const count = tasks.length;
  if (count === 0) {
    taskCount.textContent = 'Aucune tâche';
  } else if (count === 1) {
    taskCount.textContent = '1 tâche restante';
  } else {
    taskCount.textContent = count + ' tâches restantes';
  }
}

// Fonction pour ajouter une tâche
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    tasks.push(taskText);
    render();
    taskInput.value = '';
    saveTasks();
  }
}

// Recrée la liste entière dans le DOM
function render() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    // Span pour le texte de la tâche
    const span = document.createElement('span');
    span.textContent = task;
    span.className = 'task-text';

    // Bonus: Double-clic pour éditer
    span.addEventListener('dblclick', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = task;
      input.className = 'edit-input';

      // Remplace le span par l'input
      li.replaceChild(input, span);
      input.focus();

      // Sauvegarde à la perte de focus ou Entrée
      function saveEdit() {
        const newText = input.value.trim();
        if (newText !== '') {
          tasks[index] = newText;
          saveTasks();
        }
        render();
      }

      input.addEventListener('blur', saveEdit);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveEdit();
        } else if (e.key === 'Escape') {
          render(); // Annule l'édition
        }
      });
    });

    li.appendChild(span);

    // Bouton supprimer
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      render();
      saveTasks();
    });
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updateCounter();
}

// Au chargement de la page
document.addEventListener('DOMContentLoaded', loadTasks);

// Clic sur Ajouter
addTaskBtn.addEventListener('click', addTask);

// Bonus: Touche Entrée pour ajouter
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Effacer toutes les tâches (avec removeItem comme demandé)
clearBtn.addEventListener('click', () => {
  tasks = [];
  localStorage.removeItem('tasks');
  render();
});
