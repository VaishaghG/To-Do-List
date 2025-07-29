const plusIcon = document.getElementById('plus-icon');
const page = document.getElementById('page');
const list = document.getElementById('list');
const colorkey = document.getElementById('color-switch');
const more = document.getElementById('more');
const timestampDisplay = document.getElementById("edit-timestamp");
let inputBox = null;

const storagekey = "taskList";

function loadTasks() {
    const saved = localStorage.getItem(storagekey);
    if (!saved) return;

    const tasks = JSON.parse(saved);
    tasks.forEach(task => {
        createTaskElement(task.text, task.completed);
    });
}

function saveTasks() {
    const taskElements = list.querySelectorAll('.list-item');
    const taskArray = [];

    taskElements.forEach(item => {
        const text = item.querySelector('span').textContent;
        const completed = item.querySelector('input').checked;
        taskArray.push({ text, completed });
    });

    localStorage.setItem(storagekey, JSON.stringify(taskArray));
}

function createTaskElement(taskText, isCompleted = false) {
    const itemContainer = document.createElement("div");
    itemContainer.className = "list-item";

    const taskLabel = document.createElement("span");
    taskLabel.textContent = taskText;
    if (isCompleted) {
        taskLabel.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = isCompleted;

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            taskLabel.classList.add("completed");
        } else {
            taskLabel.classList.remove("completed");
        }
        updateTimestamp();
        saveTasks();
    });

    itemContainer.appendChild(taskLabel);
    itemContainer.appendChild(checkbox);
    list.appendChild(itemContainer);
}

plusIcon.addEventListener("click", function () {
    if (!inputBox) {
        inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.placeholder = "Enter task...";
        inputBox.className = "task-input";
        page.appendChild(inputBox);
        inputBox.focus();

        inputBox.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && inputBox.value.trim() !== "") {
                const taskText = inputBox.value.trim();
                createTaskElement(taskText);
                updateTimestamp();
                saveTasks();
                inputBox.remove();
                inputBox = null;
            }
        });
    }
});

document.addEventListener("click", function (e) {
    if (inputBox && !e.target.classList.contains("task-input") && e.target !== plusIcon) {
        inputBox.remove();
        inputBox = null;
    }
});


const colors = ['#FFD1DC', '#D0F0C0', '#B3E5FC', '#E1BEE7', '#ffffff', '#F6E05D'];
let index = 0;
colorkey.addEventListener("click", function () {
    page.style.backgroundColor = colors[index];
    plusIcon.style.color = colors[index];
    plusIcon.style.backgroundColor = index === 4 ? '#f7efaf' : '#ffffff';
    index = (index + 1) % colors.length;
});

function updateTimestamp() {
    const now = new Date().getTime();
    localStorage.setItem("lastEdited", now.toString());
    displayRelativeTime(now);
}

function displayRelativeTime(timestamp) {
    if (!timestamp) return;

    const now = Date.now();
    const diffMs = now - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    let message = "";
    if (diffSec < 60) {
        message = "Edited just now";
    } else if (diffMin === 1) {
        message = "Edited 1 minute ago";
    } else if (diffMin < 60) {
        message = `Edited ${diffMin} minutes ago`;
    } else if (diffHr === 1) {
        message = "Edited 1 hour ago";
    } else if (diffHr < 24) {
        message = `Edited ${diffHr} hours ago`;
    } else if (diffDay === 1) {
        message = "Edited yesterday";
    } else {
        const date = new Date(timestamp);
        message = `Edited on ${date.toLocaleDateString()}`;
    }

    timestampDisplay.textContent = message;
    timestampDisplay.style.display = "block";
}

function checkListAndUpdateTimestamp() {
    if (list.children.length === 0) {
        localStorage.removeItem("lastEdited");
        timestampDisplay.textContent = "";
        timestampDisplay.style.display = "none";
    }
}

window.addEventListener("load", () => {
    loadTasks();

    const saved = localStorage.getItem("lastEdited");
    if (saved) {
        displayRelativeTime(parseInt(saved));
    }

    checkListAndUpdateTimestamp();

    setInterval(() => {
        const saved = localStorage.getItem("lastEdited");
        if (saved) {
            displayRelativeTime(parseInt(saved));
        }
    }, 60000);
});
