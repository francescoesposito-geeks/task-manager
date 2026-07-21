import { Task } from "../../types/board";
import { mapRowToTask, mapTaskToRow, TaskRow } from "../mappers/task";
import { supabase } from "../supabase/client";

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Errore nel caricamento delle task:", error.message);
    return [];
  }

  return data.map((row) => mapRowToTask(row));
}

export async function createTask(task: Omit<Task, "id">): Promise<Task | null> {
  const { data, error } = await supabase
    .from("tasks")
    .insert(mapTaskToRow(task))
    .select()
    .single();

  if (error) {
    console.error("Errore nella creazione della task:", error.message);
    return null;
  }

  return mapRowToTask(data);
}

export async function updateTask(task: Task): Promise<Task | null> {
  const { data, error } = await supabase
    .from("tasks")
    .update(mapTaskToRow(task))
    .eq("id", task.id)
    .select()
    .single();

  if (error) {
    console.error("Errore nell'aggiornamento della task:", error.message);
    return null;
  }

  return mapRowToTask(data as TaskRow);
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    console.error("Errore nell'eliminazione della task:", error.message);
    return false;
  }

  return true;
}
