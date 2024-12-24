const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list")) || [];

function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
  todoAlert.removeAttribute("class");
  todoAlert.innerText = message;
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 1000);
}

function CreateToDoItems() {
  if (todoValue.value === "") {
    setAlertMessage("Пожалуйста, введите текст задачи!");
    todoValue.focus();
    return;
  }

  let IsPresent = todo.some((element) => element.item === todoValue.value);
  if (IsPresent) {
    setAlertMessage("Эта задача уже есть в листе!");
    return;
  }

  let li = document.createElement("li");
  const todoItems = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div>
    <div><img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="img/pencil.png" />
    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="img/delete.png" /></div>`;
  li.innerHTML = todoItems;
  listItems.appendChild(li);

  todo.push({ item: todoValue.value, status: false });
  setLocalStorage();
  todoValue.value = "";
  setAlertMessage("Задача успешно добавлена!");
}

function ReadToDoItems() {
  listItems.innerHTML = "";
  todo.forEach((element) => {
    let li = document.createElement("li");
    let style = element.status ? "style='text-decoration: line-through'" : "";
    const todoItems = `<div ${style} title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${
      element.item
    }
        ${
          element.status
            ? '<img class="todo-controls" src="img/check-mark.png" />'
            : ""
        }</div><div>
        ${
          !element.status
            ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="img/pencil.png" />'
            : ""
        }
        <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="img/delete.png" /></div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);
  });
}

function DeleteToDoItems(element) {
  let deleteValue =
    element.parentElement.parentElement.querySelector("div").innerText;
  if (
    confirm(`Ты серьезно хочешь избавиться от этой задачи? ${deleteValue}!`)
  ) {
    const li = element.parentElement.parentElement;
    li.classList.add("deleted-item");

    setTimeout(() => {
      todo = todo.filter((item) => item.item !== deleteValue.trim());
      setLocalStorage();
      ReadToDoItems();
      setAlertMessage("Задача успешно удалена!");
    }, 1000);
  }
}
let updateText = null;

function UpdateToDoItems(element) {
  const itemText =
    element.parentElement.parentElement.querySelector("div").innerText;
  todoValue.value = itemText;
  updateText = element.parentElement.parentElement.querySelector("div");
  addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
  addUpdate.setAttribute("src", "img/refresh.png");
  todoValue.focus();
}

function UpdateOnSelectionItems() {
  let IsPresent = todo.some((element) => element.item === todoValue.value);
  if (IsPresent) {
    setAlertMessage("Эта задача уже есть в листе!");
    return;
  }

  todo.forEach((element) => {
    if (element.item === updateText.innerText.trim()) {
      element.item = todoValue.value;
    }
  });
  setLocalStorage();
  updateText.innerText = todoValue.value;
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  addUpdate.setAttribute("src", "img/plus.gif");
  todoValue.value = "";
  setAlertMessage("Задача успешно добавлена!");
}

function CompletedToDoItems(element) {
  const itemDiv = element.parentElement.querySelector("div");
  if (itemDiv.style.textDecoration === "") {
    itemDiv.style.textDecoration = "line-through";
    const img = document.createElement("img");
    img.src = "img/check-mark.png";
    img.className = "todo-controls";
    itemDiv.appendChild(img);
    element.parentElement.querySelector("img.edit").remove();

    todo.forEach((element) => {
      if (itemDiv.innerText.trim() === element.item) {
        element.status = true;
      }
    });
    setLocalStorage();
    setAlertMessage("Задача успешно добавлена!");
  } else {
    itemDiv.style.textDecoration = "";
    const img = itemDiv.querySelector("img");
    if (img) img.remove();
    todo.forEach((element) => {
      if (itemDiv.innerText.trim() === element.item) {
        element.status = false;
      }
    });
    setLocalStorage();
    setAlertMessage("Пункт текущих задач открылся повторно!");
  }
}

ReadToDoItems();
