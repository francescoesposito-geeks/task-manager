import { STORAGE_MODE } from "../config";
import { Task } from "../../types/board";
import { createLocalTaskRepository } from "./localTasks";
import { createSupabaseTaskRepository } from "./supabaseTasks";

// The rest of the app only uses this interface:
// it does not know if tasks are saved in the browser or in Supabase.
export interface TaskRepository {
  fetchTasks(): Promise<Task[]>;
  createTask(task: Omit<Task, "id">): Promise<Task>;
  updateTask(task: Task): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
}

// userId is the local profile id or the Supabase user id
export function getTaskRepository(userId: string): TaskRepository {
  return STORAGE_MODE === "supabase"
    ? createSupabaseTaskRepository()
    : createLocalTaskRepository(userId);
}
