/* eslint-disable no-param-reassign */
import { update } from "lodash";
import format from "date-fns/format";
import projectsManager, { projects } from "./projects";
import tasksManager from "./tasks";
import storage from "./localStorage";

export const addProjectBtn = document.getElementById("add-project-btn");
export const addTaskBtn = document.getElementById("add-task-btn");
export const addProjectContainer = document.querySelector(
  ".add-project-container"
);
export const addProjectName = document.getElementById("add-project-name");
export const currentProjectHeader = document.querySelector(
  ".current-project-header"
);
export const taskContainer = document.querySelector(".tasks-container");
export const addTaskName = document.getElementById("add-task-name");
export const addTaskDate = document.getElementById("add-task-date");
export const addTaskDescription = document.getElementById(
  "add-task-description"
);
const projectModal = document.querySelector(".project-modal");
const taskModal = document.querySelector(".task-modal");

function openProjectModal() {
  projectModal.style.display = "flex";
  addProjectBtn.style.display = "none";
}

function closeProjectModal() {
  projectModal.style.display = "none";
  addProjectBtn.style.display = "grid";
}

function updateProjectHeader(projectName) {
  currentProjectHeader.textContent = projectName;

  projects.forEach((project) => {
    if (project.name === projectName) {
      currentProjectHeader.id = project.id;
    }
  });
}

function setAsCurrentProject(projectId) {
  const projectList = document.querySelectorAll(".project-list");
  projectList.forEach((project) => {
    project.style.backgroundColor = "";

    if (project.id === projectId) {
      const currentProject = projectsManager.setCurrentProject(project.id);
      updateProjectHeader(currentProject.name);
      project.style.backgroundColor = "rgb(250, 170, 141)";
    }
  });
}

function editProject(e) {
  const projectList = document.querySelectorAll(".project-list");

  projectList.forEach((project) => {
    if (e.target.id === project.id) {
      project.style.display = "none";

      const editProjectContainer = document.createElement("div");
      editProjectContainer.className = "edit-project-container";
      addProjectContainer.insertBefore(editProjectContainer, project);

      const editProjectInput = document.createElement("input");
      const originalProjectName =
        project.querySelector(".project-name").textContent;
      editProjectInput.value = originalProjectName;
      editProjectInput.className = "edit-project-input";
      editProjectContainer.appendChild(editProjectInput);

      const editProjectBtnContainer = document.createElement("div");
      editProjectBtnContainer.className = "edit-project-btn-container";
      editProjectContainer.appendChild(editProjectBtnContainer);

      const projectSubmitEdit = document.createElement("button");
      projectSubmitEdit.className = "submit-edit-btn";
      projectSubmitEdit.id = project.id;
      projectSubmitEdit.textContent = "Edit";
      editProjectBtnContainer.appendChild(projectSubmitEdit);

      const projectCancelEdit = document.createElement("button");
      projectCancelEdit.className = "cancel-edit-btn";
      projectCancelEdit.id = project.id;
      projectCancelEdit.textContent = "Cancel";
      editProjectBtnContainer.appendChild(projectCancelEdit);

      projectSubmitEdit.addEventListener("click", () => {
        if (editProjectInput.value !== "") {
          const projectName = project.querySelector(".project-name");
          const projectNewName = editProjectInput.value;
          editProjectInput.value = "";
          editProjectContainer.style.display = "none";
          projectName.textContent = projectNewName;
          project.style.display = "grid";
          projectsManager.editProject(project.id, projectNewName);
          setAsCurrentProject(project.id);
          storage.editStorage(project.id);
        }
      });

      projectCancelEdit.addEventListener("click", () => {
        editProjectInput.value = "";
        editProjectContainer.remove();
        project.style.display = "grid";
      });
    }
  });
}

function removeTaskListDOM() {
  const taskList = document.querySelectorAll(".task-list");

  taskList.forEach((task) => {
    task.remove();
  });
}
function editTask(e) {
  const taskList = document.querySelectorAll(".task-list");

  taskList.forEach((task) => {
    if (e.target.id === task.id) {
      task.style.display = "none";
      const editTaskContainer = document.createElement("div");
      editTaskContainer.className = "edit-task-container";
      taskContainer.insertBefore(editTaskContainer, task);

      const editTaskNameDescriptionContainer = document.createElement("div");
      editTaskNameDescriptionContainer.className =
        "edit-task-name-description-container";
      editTaskContainer.appendChild(editTaskNameDescriptionContainer);
      const editTaskNameInput = document.createElement("input");
      const originalTaskName = task.querySelector(".task-name").textContent;
      editTaskNameInput.value = originalTaskName;
      editTaskNameInput.className = "edit-task-name";
      editTaskNameDescriptionContainer.appendChild(editTaskNameInput);

      const editTaskDescriptionInput = document.createElement("input");
      const originalTaskDescription =
        task.querySelector(".task-description").textContent;
      editTaskDescriptionInput.value = originalTaskDescription;
      editTaskDescriptionInput.className = "edit-task-description";
      editTaskNameDescriptionContainer.appendChild(editTaskDescriptionInput);

      const editTaskDateInput = document.createElement("input");
      editTaskDateInput.setAttribute("type", "date");
      const originalTaskDate = tasksManager.getCurrentTask(task.id).dueDate;
      editTaskDateInput.value = originalTaskDate;
      editTaskDateInput.className = "edit-due-date";
      editTaskContainer.appendChild(editTaskDateInput);

      const editTaskBtnContainer = document.createElement("div");
      editTaskBtnContainer.className = "edit-task-btn-container";
      editTaskContainer.appendChild(editTaskBtnContainer);

      const taskSubmitEdit = document.createElement("button");
      taskSubmitEdit.className = "submit-edit-btn";
      taskSubmitEdit.id = task.id;
      taskSubmitEdit.textContent = "Edit";
      editTaskBtnContainer.appendChild(taskSubmitEdit);

      const taskCancelEdit = document.createElement("button");
      taskCancelEdit.className = "cancel-edit-btn";
      taskCancelEdit.id = task.id;
      taskCancelEdit.textContent = "Cancel";
      editTaskBtnContainer.appendChild(taskCancelEdit);

      taskSubmitEdit.addEventListener("click", () => {
        if (editTaskNameInput.value !== "" && editTaskDateInput.value !== "") {
          task.style.display = "grid";

          const taskName = task.querySelector(".task-name");
          const taskDescription = task.querySelector(".task-description");
          const dueDate = task.querySelector(".due-date");

          taskName.textContent = editTaskNameInput.value;
          taskDescription.textContent = editTaskDescriptionInput.value;
          dueDate.textContent = format(
            new Date(editTaskDateInput.value),
            "dd LLL yy"
          );
          tasksManager.editTask(
            task.id,
            taskName.textContent,
            taskDescription.textContent,
            editTaskDateInput.value
          );
          editTaskContainer.remove();
        }
      });

      taskCancelEdit.addEventListener("click", () => {
        task.style.display = "grid";
        editTaskNameInput.value = "";
        editTaskDateInput.value = "";
        editTaskDescriptionInput.value = "";
        editTaskContainer.remove();
      });
    }
  });
}

function deleteTaskDiv(e) {
  const taskList = document.querySelectorAll(".task-list");

  taskList.forEach((task) => {
    if (e.target.id === task.id) {
      tasksManager.deleteTask(task.id);
      task.remove();
    }
  });
}

function markComplete(e) {
  const taskList = document.querySelectorAll(".task-list");

  taskList.forEach((task) => {
    const taskNameDescriptionContainer = task.querySelector(
      ".task-name-description-container"
    );
    const editTaskBtn = task.querySelector(".edit-task-btn");
    const dueDate = task.querySelector(".due-date");

    function styleComplete() {
      if (tasksManager.getCurrentTask(task.id).status === "Not Complete") {
        taskNameDescriptionContainer.classList.remove("complete");
        dueDate.classList.remove("complete");
        task.classList.remove("complete");
      } else {
        taskNameDescriptionContainer.classList.add("complete");
        dueDate.classList.add("complete");
        task.classList.add("complete");
      }
    }

    if (e.target.id === task.id && e.target !== editTaskBtn) {
      tasksManager.updateTaskStatus(task.id);
      styleComplete();
    }
  });
}

function appendNewTask(project) {
  const taskList = document.createElement("div");
  taskList.className = "task-list";
  taskList.id = project.id;
  taskContainer.insertBefore(taskList, taskModal);
  addTaskName.value = "";

  const taskNameDescriptionContainer = document.createElement("div");
  taskNameDescriptionContainer.className = "task-name-description-container";
  taskNameDescriptionContainer.id = project.id;
  taskList.appendChild(taskNameDescriptionContainer);

  const taskName = document.createElement("div");
  taskName.className = "task-name";
  taskName.id = project.id;
  taskName.textContent = project.name;
  taskNameDescriptionContainer.appendChild(taskName);

  const taskDescription = document.createElement("div");
  taskDescription.className = "task-description";
  taskDescription.id = project.id;
  taskDescription.textContent = project.description;
  taskNameDescriptionContainer.appendChild(taskDescription);
  addTaskDescription.value = "";

  const dueDate = document.createElement("div");
  dueDate.className = "due-date";
  dueDate.id = project.id;
  dueDate.textContent = format(new Date(project.dueDate), "dd LLL yy");
  taskList.appendChild(dueDate);
  dueDate.value = "";

  const taskBtnContainer = document.createElement("div");
  taskBtnContainer.className = "task-btn-container";
  taskList.appendChild(taskBtnContainer);

  const editBtn = document.createElement("button");
  editBtn.classList.add("task-list-btn", "edit-task-btn");
  editBtn.id = project.id;
  editBtn.textContent = "Edit";
  taskBtnContainer.appendChild(editBtn);

  const delBtn = document.createElement("button");
  delBtn.classList.add("task-list-btn", "del-task-btn");
  delBtn.id = project.id;
  delBtn.textContent = "Delete";
  taskBtnContainer.appendChild(delBtn);

  editBtn.addEventListener("click", editTask);
  delBtn.addEventListener("click", deleteTaskDiv);
  taskList.addEventListener("click", markComplete);
}

function closeTaskModal() {
  taskModal.style.display = "none";
  addTaskBtn.style.display = "grid";
}

taskModal.addEventListener("submit", (event) => {
  event.preventDefault();
  tasksManager.addTask();
  closeTaskModal();
  appendNewTask(tasksManager.getMostRecentTask());
});

function appendCurrentProjectTasks() {
  const currentProject = tasksManager.getCurrentProject();
  const propertyArray = Object.keys(currentProject);

  propertyArray.forEach((property) => {
    if (property.startsWith("task")) {
      const currentProjectTasks = currentProject[property];
      if (Object.keys(currentProjectTasks).length > 1) {
        appendNewTask(currentProjectTasks);
        storage.styleTaskStorage();
      }
    }
  });
}

function deleteProjectDiv(e) {
  const projectList = document.querySelectorAll(".project-list");
  projectList.forEach((project) => {
    if (e.target.id === project.id) {
      project.remove();
      projectsManager.deleteProject(project.id);
      projectsManager.setCurrentProject(projectsManager.mostRecentProject().id);
      setAsCurrentProject(projectsManager.mostRecentProject().id);
      removeTaskListDOM();
      appendCurrentProjectTasks();
    }

    const projectListLength = Array.from(projectList).length;
    if (projectListLength === 1) {
      updateProjectHeader();
    }
  });
}

function switchProject(projectId) {
  const projectList = document.querySelectorAll(".project-list");

  projectList.forEach((project) => {
    project.style.backgroundColor = "";

    if (projectId === project.id) {
      setAsCurrentProject(project.id);
      removeTaskListDOM();
      appendCurrentProjectTasks();
    }
  });
}

function appendNewProject(project) {
  const projectDiv = document.createElement("div");
  projectDiv.id = project.id;
  projectDiv.className = "project-list";
  addProjectContainer.insertBefore(projectDiv, projectModal);
  addProjectName.value = "";

  const projectName = document.createElement("div");
  projectName.className = "project-name";
  projectName.id = project.id;
  projectName.textContent = project.name;
  projectDiv.appendChild(projectName);

  const projectBtnContainer = document.createElement("div");
  projectBtnContainer.className = "project-btn-container";
  projectDiv.appendChild(projectBtnContainer);

  const editBtn = document.createElement("button");
  editBtn.classList.add("project-list-btn", "edit-project-btn");
  editBtn.id = project.id;
  editBtn.textContent = "Edit";
  projectBtnContainer.appendChild(editBtn);

  const delBtn = document.createElement("button");
  delBtn.classList.add("project-list-btn", "del-project-btn");
  delBtn.id = project.id;
  delBtn.textContent = "Delete";
  projectBtnContainer.appendChild(delBtn);
  removeTaskListDOM();
  setAsCurrentProject(project.id);

  editBtn.addEventListener("click", editProject);
  delBtn.addEventListener("click", deleteProjectDiv);
  // eslint-disable-next-line func-names
  projectName.addEventListener("click", function () {
    switchProject(this.id);
  });
}

projectModal.addEventListener("submit", (event) => {
  event.preventDefault();
  projectsManager.addProject();
  closeProjectModal();
  updateProjectHeader(projectsManager.mostRecentProject().name);
  appendNewProject(projectsManager.mostRecentProject());
  projectsManager.setCurrentProject(projectsManager.mostRecentProject().id);
});

function taskAddErrorModal() {
  const taskAddErrorContainer = document.createElement("div");
  taskAddErrorContainer.className = "task-add-error-container";
  document.body.appendChild(taskAddErrorContainer);

  const taskAddError = document.createElement("div");
  taskAddError.className = "task-add-error";
  taskAddError.textContent = "Oops! Add a project before trying again.";
  taskAddErrorContainer.appendChild(taskAddError);

  window.addEventListener(
    "click",
    () => {
      taskAddErrorContainer.remove();
    },
    true
  );
}

function openTaskModal() {
  if (projects.length >= 2) {
    taskModal.style.display = "flex";
    addTaskBtn.style.display = "none";
  } else {
    taskAddErrorModal();
  }
}

export default {
  openProjectModal,
  closeProjectModal,
  updateProjectHeader,
  setAsCurrentProject,
  editProject,
  removeTaskListDOM,
  appendCurrentProjectTasks,
  deleteProjectDiv,
  switchProject,
  appendNewProject,
  closeTaskModal,
  taskAddErrorModal,
  openTaskModal,
  appendNewTask,
  editTask,
  deleteTaskDiv,
  markComplete,
};
