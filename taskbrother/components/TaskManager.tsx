"use client";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import {
  useTasks,
  useAddTask,
  useDeleteTask,
  useUpdateTask
} from "../hooks/useTasks";

export default function TaskManager() {
  const { data = [], isLoading, isError, error } = useTasks();
  const addTaskMutation = useAddTask();
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();

  if (isLoading) return <p className="text-center mt-8">Caricamento...</p>;

  if (isError) {
    return (
      <div className="text-center mt-8 p-4 border border-red-200 bg-red-50 text-red-600 rounded-md max-w-md mx-auto">
        <p className="font-bold">Si è verificato un errore: {error.message}</p>
      </div>
    );
  }

  return (
    <>
      <TaskForm onAddTask={(t) => addTaskMutation.mutate(t)} />
      <TaskList
        tasks={data}
        onRemoveTask={(id) => deleteTaskMutation.mutate(id)}
        onUpdateTask={(t) => updateTaskMutation.mutate(t)}
      />
    </>
  );
}
