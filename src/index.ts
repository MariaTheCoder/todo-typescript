import { v4 as uuidV4 } from 'uuid';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>('#list');
const form = document.querySelector<HTMLFormElement>('#new-task-form');
const input = document.querySelector<HTMLInputElement>('#new-task-title');
const clearTasks = document.querySelector<HTMLButtonElement>('#clear-tasks');

/* 
Make use of local storage of tasks.
By default, load all stored tasks and display in the document.
*/
let tasks: Task[] = loadLocalStorage();
tasks.forEach(addListItem);

/*
Add an event listener to the form element 
*/
form?.addEventListener('submit', (e) => {
  e.preventDefault();

  renderTodos();
});

/*
Add an event listener to the clearTasks button
*/
clearTasks?.addEventListener('click', () => {
  clearLocalStorage();
  tasks = [];

  if (list == null) return;
  list.innerHTML = '';

  renderTodos();
});

/*
Create a render function which can be accessed from anywhere in this file
*/
function renderTodos() {
  if (input?.value == '' || input?.value == null) return;

  const newTask: Task = {
    id: uuidV4(),
    title: input?.value,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  saveToLocalStorage();

  addListItem(newTask);
  input.value = '';
}

/*
Add new task to the list in the document
*/
function addListItem(task: Task) {
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');

  // create icons
  const edit = document.createElement('i');

  // add eventlistniner to the event 'change' for checkboxes
  // when toggling whether a checkbox is checked or not in the document
  // then also change the value of task.completed
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveToLocalStorage();
  });

  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  edit.innerText = '🖍️';
  label.append(checkbox, task.title);
  item.append(label, edit);
  list?.append(item);
}

/*
Save to-dos to local storage
*/
function saveToLocalStorage() {
  localStorage.setItem('TASKS', JSON.stringify(tasks));
}

/*
Load to-dos from the local storage
*/
function loadLocalStorage(): Task[] {
  const taskJSON = localStorage.getItem('TASKS');

  if (taskJSON == null) return [];

  return JSON.parse(taskJSON);
}

/*
Clear local storage
*/
function clearLocalStorage() {
  localStorage.clear();
}
