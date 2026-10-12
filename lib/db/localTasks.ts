import { z } from "zod";
import { Task } from "../../types/board";
import { taskFieldsSchema } from "../schemas/task";
import type { TaskRepository } from "./task";
import { STORAGE_KEYS } from "../storageKeys";

const storedTaskSchema = taskFieldsSchema.extend({ id: z.string() });

function storageKey(profileId: string) {
  return STORAGE_KEYS.tasks(profileId);
}

function readTasks(profileId: string): Task[] {
  try {
    const saved = JSON.parse(
      localStorage.getItem(storageKey(profileId)) ?? "[]"
    );
    if (!Array.isArray(saved)) {
      return [];
    }
    // ignores items that are not valid tasks instead of breaking the board
    return saved.flatMap((item) => {
      const result = storedTaskSchema.safeParse(item);
      return result.success ? [result.data as Task] : [];
    });
  } catch {
    return [];
  }
}

function writeTasks(profileId: string, tasks: Task[]) {
  localStorage.setItem(storageKey(profileId), JSON.stringify(tasks));
}

export function createLocalTaskRepository(profileId: string): TaskRepository {
  return {
    async fetchTasks() {
      return readTasks(profileId);
    },

    async createTask(task) {
      const newTask: Task = { ...task, id: crypto.randomUUID() };
      writeTasks(profileId, [...readTasks(profileId), newTask]);
      return newTask;
    },

    async updateTask(task) {
      const tasks = readTasks(profileId);
      if (!tasks.some((item) => item.id === task.id)) {
        throw new Error("Task non trovata.");
      }
      writeTasks(
        profileId,
        tasks.map((item) => (item.id === task.id ? task : item))
      );
      return task;
    },

    async deleteTask(taskId) {
      writeTasks(
        profileId,
        readTasks(profileId).filter((item) => item.id !== taskId)
      );
    }
  };
}
