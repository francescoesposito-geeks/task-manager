export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "importante" | "non-importante";
  urgency: "urgente" | "non-urgente";
  state: "to-do" | "blocked" | "doing" | "testing" | "done";
  deadline?: string;
}

export interface Column {
  id: string;
  title: string;
}
