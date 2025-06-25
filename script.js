const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    if (filter === "active" && task.completed) return;
    if (filter === "completed" && !task.completed) return;

    const li = document.createElement("li");
    li.className = "task";
    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks(filter);
    });

    // Double click to edit
    span.addEventListener("dblclick", () => {
      const newText = prompt("Edit your task:", task.text);
      if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks(filter);
      }
    });

    const time = document.createElement("time");
    time.textContent = task.time;

    const actions = document.createElement("div");
    actions.className = "actions";

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.title = "Delete task";
    delBtn.addEventListener("click", () => {
      if (confirm("Are you sure to delete this task?")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(filter);
      }
    });

    actions.appendChild(delBtn);

    li.appendChild(span);
    li.appendChild(time);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (text === "") return alert("Enter a task!");

  const newTask = {
    text,
    completed: false,
    time: new Date().toLocaleString()
  };

  tasks.push(newTask);
  input.value = "";
  saveTasks();
  renderTasks();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    renderTasks(btn.dataset.filter);
  });
});

renderTasks();
