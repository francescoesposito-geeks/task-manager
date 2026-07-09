export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "importante" | "non-importante";
  urgency: "urgente" | "non-urgente";
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
