import { Task } from "../../types/board";

export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  priority: Task["priority"];
  urgency: Task["urgency"];
  state: Task["state"];
  start_date: string;
  end_date: string;
  created_at: string;
}

// DB -> Frontend
export function mapRowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    priority: row.priority,
    urgency: row.urgency,
    state: row.state,
    startDate: row.start_date,
    endDate: row.end_date
  };
}

// Frontend -> DB
export function mapTaskToRow(
  task: Omit<Task, "id">
): Omit<TaskRow, "id" | "created_at"> {
  return {
    title: task.title,
    description: task.description ?? null,
    priority: task.priority,
    urgency: task.urgency,
    state: task.state,
    start_date: task.startDate,
    end_date: task.endDate
  };
}
