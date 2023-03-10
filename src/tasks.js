/* eslint-disable no-param-reassign */
/* eslint-disable no-self-assign */
import { get } from "lodash";
import storage from "./localStorage";
import projectsManager, { projects } from "./projects";
import UI, {
  addTaskName,
  addTaskDate,
  addTaskDescription,
  currentProjectHeader,
} from "./UI";

function taskFactory(name, description, dueDate, id, status) {
  name = name;
  description = description;
  dueDate = dueDate;
  id = id;
  status = status;
  return {
    name,
    description,
    dueDate,
    id,
    status,
  };
}

function getCurrentProject() {
  const currentProject = projectsManager.setCurrentProject(
    currentProjectHeader.id
  );
  return currentProject;
}

function addTask() {
  getCurrentProject();

  const currentProjectLength = Object.keys(getCurrentProject()).length;
  const taskCount = currentProjectLength - 2;
  const task = taskFactory(
    addTaskName.value,
    addTaskDescription.value,
    addTaskDate.value,
    `task${taskCount}`,
    "Not Complete"
  );

  (function nameTaskProp() {
    getCurrentProject()[`task${taskCount}`] = task;
  })();

  storage.populateTaskStorage(getCurrentProject().id);
}

function getMostRecentTask() {
  getCurrentProject();
  const currentProjectValues = Object.values(getCurrentProject());
  const mostRecentTask = currentProjectValues[currentProjectValues.length - 1];
  return mostRecentTask;
}

function getCurrentTask(taskId) {
  const currentTask = getCurrentProject()[taskId];
  return currentTask;
}

function deleteTask(taskId) {
  getCurrentProject()[taskId] = {};
  storage.deleteTaskStorage(taskId);
}

function editTask(taskId, newTaskName, newTaskDescription, newTaskDate) {
  getCurrentTask(taskId).name = newTaskName;
  getCurrentTask(taskId).description = newTaskDescription;
  getCurrentTask(taskId).dueDate = newTaskDate;
  storage.editTaskStorage(getCurrentTask(taskId));
}

function updateTaskStatus(taskId) {
  if (getCurrentTask(taskId).status === "Complete") {
    getCurrentTask(taskId).status = "Not Complete";
  } else {
    getCurrentTask(taskId).status = "Complete";
  }
  storage.populateTaskStorage(getCurrentProject().id);
}

export default {
  getCurrentProject,
  addTask,
  getMostRecentTask,
  getCurrentTask,
  deleteTask,
  editTask,
  updateTaskStatus,
};
