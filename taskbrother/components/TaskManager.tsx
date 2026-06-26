"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { Task } from "./TaskItem";

export default function TaskManager() {
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
    error
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("/api/tasks", { method: "GET" });
      if (!res.ok) throw new Error("Errore nel caricamento");
      return res.json();
    }
  });

  const addTaskMutation = useMutation({
    mutationFn: async (nuovoTask: Task) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuovoTask)
      });
      if (!res.ok) throw new Error("Errore nel salvataggio");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: Task) => {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask)
      });
      if (!res.ok) throw new Error("Errore durante la modifica");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });

  const handleAddTask = (nuovoTask: Task) => {
    addTaskMutation.mutate(nuovoTask);
  };

  const handleRemoveTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    updateTaskMutation.mutate(updatedTask);
  };

  if (isLoading) return <p className="text-center mt-8">Caricamento...</p>;

  if (isError) {
    return (
      <div className="text-center mt-8 p-4 border border-red-200 bg-red-50 text-red-600 rounded-md max-w-md mx-auto">
        {error && (
          <p className="font-bold">
            Si è verificato un errore: {error.message}
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <TaskForm onAddTask={handleAddTask} />
      <TaskList
        tasks={data}
        onRemoveTask={handleRemoveTask}
        onUpdateTask={handleUpdateTask}
      />
    </>
  );
}
