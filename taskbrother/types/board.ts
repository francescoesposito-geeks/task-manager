export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "importante" | "non-importante";
  urgency: "urgente" | "non-urgente";
  state: "to-do" | "blocked" | "doing" | "testing" | "done";
  startDate: string;
  endDate: string;
}

export interface Column {
  id: string;
  title: string;
}
