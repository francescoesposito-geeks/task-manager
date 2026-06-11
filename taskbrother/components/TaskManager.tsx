import { useState } from "react";
import TaskForm from "./TaskList";
import { Task } from "./TaskItem";

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (nuovoTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, nuovoTask]);
  };

  return (
    <>
      <TaskForm onAddTask={handleAddTask} />
    </>
  );
}
