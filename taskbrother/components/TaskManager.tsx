"use client";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { useState } from "react";

import { Task } from "./TaskItem";

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (nuovoTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, nuovoTask]);
  };
  return (
    <>
      <TaskForm onAddTask={handleAddTask} />
      <TaskList tasks={tasks} />
    </>
  );
}
