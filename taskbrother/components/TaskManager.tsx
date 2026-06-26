"use client";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Task } from "./TaskItem";

export default function TaskManager() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);

  const handleAddTask = (nuovoTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, nuovoTask]);
  };

  const handleRemoveTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  return (
    <>
      <TaskForm onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onRemoveTask={handleRemoveTask}
        onUpdateTask={handleUpdateTask}
      />
    </>
  );
}
