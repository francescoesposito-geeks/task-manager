import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "../types/board";
import { getTaskRepository } from "../lib/db/task";

// Loads and changes the tasks of the current user with TanStack Query.
// Updates and deletions are shown immediately and rolled back if saving fails.
export function useTasks(userId: string) {
  const queryClient = useQueryClient();
  const repository = useMemo(() => getTaskRepository(userId), [userId]);
  const queryKey = useMemo(() => ["tasks", userId], [userId]);

  const tasksQuery = useQuery({
    queryKey,
    queryFn: () => repository.fetchTasks()
  });

  const createMutation = useMutation({
    mutationFn: (task: Omit<Task, "id">) => repository.createTask(task),
    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(queryKey, (old = []) => [
        ...old,
        newTask
      ]);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (task: Task) => repository.updateTask(task),
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.map((item) => (item.id === task.id ? task : item))
      );
      return { previous };
    },
    onError: (_error, _task, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => repository.deleteTask(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.filter((item) => item.id !== taskId)
      );
      return { previous };
    },
    onError: (_error, _taskId, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isPending,
    loadError: tasksQuery.error,
    createTask: createMutation.mutateAsync,
    updateTask: updateMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync
  };
}
