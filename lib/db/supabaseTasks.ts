import { Task } from "../../types/board";
import { mapRowToTask, mapTaskToRow, TaskRow } from "../mappers/task";
import { getSupabase } from "../supabase/client";
import type { TaskRepository } from "./task";

// Each user sees only their own tasks: the "tasks" table has Row Level Security
// and a user_id column filled automatically with auth.uid() (see supabase/schema.sql).
export function createSupabaseTaskRepository(): TaskRepository {
  return {
    async fetchTasks() {
      const { data, error } = await getSupabase()
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error("Impossibile caricare le task: " + error.message);
      }
      return (data as TaskRow[]).map(mapRowToTask);
    },

    async createTask(task) {
      const { data, error } = await getSupabase()
        .from("tasks")
        .insert(mapTaskToRow(task))
        .select()
        .single();

      if (error) {
        throw new Error("Impossibile creare la task: " + error.message);
      }
      return mapRowToTask(data as TaskRow);
    },

    async updateTask(task: Task) {
      const { data, error } = await getSupabase()
        .from("tasks")
        .update(mapTaskToRow(task))
        .eq("id", task.id)
        .select()
        .single();

      if (error) {
        throw new Error("Impossibile aggiornare la task: " + error.message);
      }
      return mapRowToTask(data as TaskRow);
    },

    async deleteTask(taskId) {
      const { error } = await getSupabase()
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) {
        throw new Error("Impossibile eliminare la task: " + error.message);
      }
    }
  };
}
