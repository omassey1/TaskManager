
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

//Function that display's the tasks
const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }
  //Clears the tasks
  tasksDiv.innerHTML = "";
  //Fetch All The Keys in local storage
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();
  for (let key of tasks) {
    
    //Grabs all values
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    //returns a live collection of the class attributes of the element.
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);
    taskInnerDiv.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;
    //localstorage would store boolean as string so we parse it to boolean back
    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    //Adds icon styling
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!JSON.parse(value)) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskInnerDiv.classList.add("completed");
    }
    taskInnerDiv.appendChild(editButton);
    //Adds Trashcan icon
    taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
    tasksDiv.appendChild(taskInnerDiv);
  }

//Function on window load
window.onload = () => {
  updateNote = "";
  //Count is equal to the amount of keys in our local storage
  count = Object.keys(localStorage).length;
  displayTasks();
};

  //tasks completed
  tasks = document.querySelectorAll(".task");
  tasks.forEach((element) => {
    element.onclick = () => {
      //local storage update
      if (element.classList.contains("completed")) {
        //Selecting the the index of 0 and adding a underscore
        updateStorage(element.id.split("_")[0], element.innerText, false);
      } else {
        updateStorage(element.id.split("_")[0], element.innerText, true);
      }
    };
  });
  //Edit Tasks
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element) => {
    element.addEventListener("click", (e) => {
      //Stop propogation to outer elements (if removed when we click delete eventually rhw click will move to parent)
      e.stopPropagation();
      //disable other edit buttons when one task is being edited
      disableButtons(true);
      //update input value and remove div
      let parent = element.parentElement;
      newTaskInput.value = parent.querySelector("#taskname").innerText;
      //set updateNote to the task that is being edited
      updateNote = parent.id;
      //remove task
      parent.remove();
    });
  });
  //Delete Tasks
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      //Delete from local storage and remove div
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;
    });
  });
};
//Disables the edit button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};
//Removes a task from local storage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};
//Add a tasks to local storage
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};
//Function that Adds New Task
document.querySelector("#push").addEventListener("click", () => {
  //Enables the edit button
  disableButtons(false);
  if (newTaskInput.value.length == 0) {
    alert("Please Enter A Task");
  } else {
    //Store locally and display from local storage
    if (updateNote == "") {
      //new task
      updateStorage(count, newTaskInput.value, false);
    } else {
      //update task
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";
  }
});