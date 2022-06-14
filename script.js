// Mobile Viewport Height
const docHeight = () => {
   const doc = document.documentElement;
   doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
}
window.addEventListener('resize', docHeight);
docHeight()

// Toggle Modal
const body = document.body;
const modal = document.querySelector('#modal');
const addBtn = document.querySelector('#add-btn');
const closeBtn = document.querySelector('#close-btn');
let scrollY;

const openModal = () => {
   modal.classList.add('active');
   scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
   body.style.position = 'fixed';
   body.style.top = `-${scrollY}`;
}

const closeModal = () => {
   scrollY = body.style.top;
   body.style.position = '';
   body.style.top = '';
   window.scrollTo(0, parseInt(scrollY || '0') * -1);
   modal.classList.remove('active');
}

window.addEventListener('scroll', () => {
   document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
})

addBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

// Textarea Resize
const textarea = document.querySelector('#textarea');
textarea.addEventListener('keyup', (e) => {
   textarea.style.minheight = '32px';
   let height = e.target.scrollHeight;
   textarea.value == ''
   ? textarea.style.height = '32px'
   : textarea.style.height = `${height}px`;
})

// App Logic
const taskInput = document.querySelector('#textarea');
const tabs = document.querySelectorAll('.tabs li');
const checklist = document.querySelector('#checklist');
const saveBtn = document.querySelector('#save-btn');

let editId;
let isEdited = false;
let tasks = JSON.parse(localStorage.getItem('tasks'));

tabs.forEach(tab => {
   tab.addEventListener('click', () => {
      document.querySelector('li.active').classList.remove('active');
      tab.classList.add('active');
      showTasks(tab.id);
   })
})

function showTasks(tabs) {
   let li = '';
   if (tasks) {
      tasks.forEach((task, id) => {
         let isComplete = task.status == 'complete'
         ? 'checked'
         : '';
         if (tabs == task.status || tabs == 'pending') {
            li += `
            <li>
               <input type="checkbox" onclick="updateStatus(this)" id="${id}" ${isComplete}>
               <label for="${id}">${task.name}</label>
            </li>
            `;
         }
      })
   }
   checklist.innerHTML = li || `<li>No tasks</li>`;
}

showTasks('pending');

function updateStatus(task) {
   task.checked
   ? tasks[task.id].status = 'complete'
   : task[task.id].status = 'pending';
   localStorage.setItem('tasks', JSON.stringify(tasks));
}

saveBtn.addEventListener('click', () => {
   let userTask = taskInput.value.trim();
   if (userTask) {
      if (!isEdited) {
         if (!tasks) {
            tasks = [];
         }
         let taskInfo = {
            name: userTask,
            status: 'pending'
         };
         tasks.push(taskInfo);
      } else {
         isEdited = false;
         tasks[editId].name = userTask;
      }
      taskInput.value = '';
      localStorage.setItem('tasks', JSON.stringify(tasks));
      showTasks('pending');
      closeModal();
   }
})