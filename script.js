const body = document.querySelector('body');
const scheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');
const tabs = document.querySelectorAll('.tabs li');
const taskList = document.querySelector('.tasks');
const modal = document.querySelector('.modal');
const textarea = document.querySelector('#textarea');
const themeBtn = document.querySelector('.theme-btn');
const createBtn = document.querySelector('.create-btn');
const closeBtn = document.querySelector('.close-btn');
const submitBtn = document.querySelector('.submit-btn');

let editId;
let isEdited = false;
let tasks = JSON.parse(localStorage.getItem('tasks'));

if (currentTheme == 'dark') {
   body.classList.toggle('dark');
} else if (currentTheme == 'light') {
   body.classList.toggle('light');
}

const openModal = () => {
   modal.classList.add('visible');
   body.style.position = 'fixed';
}

const closeModal = () => {
   modal.classList.remove('visible');
   body.style.position = 'relative';
}

const toggleTheme = () => {
   if (scheme.matches) {
      body.classList.toggle('light');
      let theme = body.classList.contains('light')
         ? 'light'
         : 'dark';
      localStorage.setItem('theme', theme);
   } else {
      body.classList.toggle('dark');
      let theme = body.classList.contains('dark')
         ? 'dark'
         : 'light';
      localStorage.setItem('theme', theme);
   }
}

tabs.forEach(tab => {
   tab.addEventListener('click', () => {
      document.querySelector('li.active').classList.remove('active');
      tab.classList.add('active');
      showTasks(tab.id);
   })
})

function showTasks(tab) {
   let li = '';
   if (tasks) {
      tasks.forEach((task, id) => {
         let completed = task.status == 'completed'
            ? 'checked'
            : '';
         if (tab == task.status || tab == 'pending') {
            li += `
            <li class="task">
               <input type="checkbox" id="${id}" onclick="updateStatus(this)" ${completed}>
               <label for="${id}">${task.description}</label>
               <div class="task-controls">
               <button class="more-btn" onclick="showMenu(this)"></button>
                  <ul class="menu">
                     <li onclick='editTask(${id}, "${task.description}")'>
                        <button class="edit-btn">Edit</button>
                     </li>
                     <li onclick='deleteTask(${id}, "${tab}")'>
                        <button class="delete-btn">Delete</button>
                     </li>
                  </ul>
               </div>
            </li>
            `;
         }
      });
   }
   taskList.innerHTML = li || `<li>No tasks to display</li>`;
}

showTasks('pending');

function showMenu(selectedTask) {
   let menu = selectedTask.parentElement.lastElementChild;
   menu.classList.add('show');
   document.addEventListener('click', (e) => {
      if (e.target.tagName != 'BUTTON' || e.target != selectedTask) {
         menu.classList.remove('show');
      }
   })
}

function updateStatus(selectedTask) {
   let task = selectedTask.parentElement.lastElementChild;
   if (selectedTask.checked) {
      task.classList.add('checked');
      tasks[selectedTask.id].status = 'completed';
   } else {
      task.classList.remove('checked');
      tasks[selectedTask.id].status = 'pending';
   }
   localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTask(taskId, text) {
   editId = taskId;
   isEdited = true;
   textarea.value = text;
   textarea.focus();
}

function deleteTask(deleteId, tab) {
   isEdited = false;
   tasks.splice(deleteId, 1);
   localStorage.setItem('tasks', JSON.stringify(tasks));
   showTasks(tab);
}

submitBtn.addEventListener('click', () => {
   let userTask = textarea.value.trim();
   if (userTask) {
      if (!isEdited) {
         tasks = !tasks ? [] : tasks;
         let taskInfo = {
            description: userTask,
            status: 'pending'
         };
         tasks.push(taskInfo);
      } else {
         isEdited = false;
         tasks[editId].description = userTask;
      }
      textarea.value = '';
      localStorage.setItem('tasks', JSON.stringify(tasks));
      showTasks(document.querySelector('li.active').id);
   }
   closeModal();
})

themeBtn.addEventListener('click', toggleTheme);
createBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);